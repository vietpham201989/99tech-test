import { Before, After } from "@cucumber/cucumber"
import { chromium, firefox, webkit, BrowserType } from "@playwright/test"
import * as path from "path"
import * as fs from "fs"
import { world } from "./world"
import { AccountPage } from "../../../../pageObjects/accountPage"
import { CartPage } from "../../../../pageObjects/cartPage"
import { ProductPage } from "../../../../pageObjects/productPage"
import { IndexPage } from "../../../../pageObjects/indexPage"
import { ComPage } from "../../../../pageObjects/comPage"
import { CartFlow } from "../../../../pageObjects/flow/cartFlow"
import { reportScenarioToAllure } from "../../helpers/allure-reporter"

// Try to import Allure API
let allure: any = null
try {
  // Try allure-js-commons first
  const allureCommons = require("allure-js-commons")
  allure = allureCommons
} catch (e) {
  try {
    // Fallback to allure-playwright if available
    const { allure: allurePlaywright } = require("allure-playwright")
    allure = allurePlaywright
  } catch (e2) {
    console.warn("Allure not available. Screenshots will be saved to disk only.")
  }
}

type BrowserName = "chromium" | "firefox" | "webkit"

const baseURL = process.env.BASE_URL || "https://www.demoblaze.com"

// Ensure screenshots directory exists
const screenshotsDir = path.join(process.cwd(), "test-results", "gherkin-screenshots")
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true })
}

// Get browser type from environment variable or default to chromium
const getBrowserType = (): BrowserType => {
  const browserName: BrowserName = (process.env.BROWSER as BrowserName) || "chromium"
  switch (browserName) {
    case "firefox":
      return firefox
    case "webkit":
      return webkit
    case "chromium":
    default:
      return chromium
  }
}

async function setup() {
  // Run headless in CI environment (GitHub Actions, etc.)
  const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS
  const browserType = getBrowserType()
  world.browser = await browserType.launch({ headless: isCI || false })
  world.context = await world.browser.newContext({
    viewport: { width: 1920, height: 1080 },
    baseURL,
  })
  world.page = await world.context.newPage()
  world.comPage = new ComPage(world.page)
  world.accountPage = new AccountPage(world.page)
  world.cartPage = new CartPage(world.page)
  world.productPage = new ProductPage(world.page)
  world.indexPage = new IndexPage(world.page)
  world.cartFlow = new CartFlow(world.page)
}

async function teardown(scenario?: any) {
  let screenshotPath: string | undefined

  // Capture screenshot on failure
  if (scenario && world.page) {
    const result = scenario.result
    if (result && result.status !== "PASSED") {
      try {
        // Generate screenshot filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const scenarioName = scenario.pickle.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        screenshotPath = path.join(
          screenshotsDir,
          `${scenarioName}-${timestamp}.png`
        )

        // Take full page screenshot
        const screenshot = await world.page.screenshot({
          path: screenshotPath,
          fullPage: true,
        })

        console.log(`Screenshot saved: ${screenshotPath}`)

        // Attach screenshot to Allure report if available
        if (allure) {
          try {
            if (allure.attachment) {
              // allure-playwright API
              await allure.attachment("Screenshot on failure", screenshot, "image/png")
            } else if (allure.createAttachment) {
              // allure-js-commons API
              await allure.createAttachment(
                "Screenshot on failure",
                Buffer.from(screenshot),
                "image/png"
              )
            }
          } catch (allureError) {
            console.warn("Failed to attach screenshot to Allure:", allureError)
          }
        }
      } catch (error) {
        console.error("Failed to capture screenshot:", error)
      }
    }
  }

  // Log scenario result
  if (scenario) {
    const result = scenario.result
    const scenarioName = scenario.pickle?.name || "Unknown Scenario"
    if (result) {
      const status = result.status === "PASSED" ? "✅ PASSED" : 
                     result.status === "FAILED" ? "❌ FAILED" : 
                     result.status === "SKIPPED" ? "⏭️  SKIPPED" : "⚠️  UNDEFINED"
      
      // Calculate duration properly
      let duration = ""
      if (result.duration) {
        const durationMs = typeof result.duration === 'number' ? result.duration : parseInt(result.duration)
        if (!isNaN(durationMs) && durationMs > 0) {
          const durationSec = Math.round(durationMs / 1000000000) // Convert nanoseconds to seconds
          duration = ` (${durationSec}s)`
        }
      }
      
      console.log(`${"-".repeat(60)}`)
      console.log(`${status}: ${scenarioName}${duration}`)
      if (result.status === "FAILED" && result.message) {
        console.log(`   Error: ${result.message}`)
      }
      console.log(`${"=".repeat(60)}\n`)
    }
  }

  // Create Allure test result for this scenario
  if (scenario) {
    try {
      reportScenarioToAllure(scenario, screenshotPath)
    } catch (error) {
      console.warn("Failed to create Allure result:", error)
    }
  }

  // Close the page, context and browser
  if (world.page) {
    await world.page.close()
  }
  if (world.context) {
    await world.context.close()
  }
  if (world.browser) {
    await world.browser.close()
  }
}

Before(async (scenario) => {
  // Log scenario title and steps before running
  if (scenario) {
    const scenarioName = scenario.pickle?.name || "Unknown Scenario"
    const featureName = scenario.gherkinDocument?.feature?.name || "Unknown Feature"
    const steps = scenario.pickle?.steps || []
    
    console.log(`\n${"=".repeat(60)}`)
    console.log(`Feature: ${featureName}`)
    console.log(`Scenario: ${scenarioName}`)
    console.log(`${"=".repeat(60)}`)
    
    if (steps.length > 0) {
      console.log(`Steps:`)
      steps.forEach((step: any, index: number) => {
        const keyword = step.keyword || ""
        const text = step.text || ""
        console.log(`  ${index + 1}. ${keyword}${text}`)
      })
      console.log(`${"-".repeat(60)}`)
    }
  }
  
  await setup()
})

After(async (scenario) => {
  await teardown(scenario)
})

