/**
 * Allure Reporter for Cucumber/Gherkin tests
 * Creates Allure test result JSON files from Cucumber scenarios
 */

import * as fs from "fs"
import * as path from "path"
import { randomUUID } from "crypto"

const allureResultsDir = path.join(process.cwd(), "allure-results")

// Ensure allure-results directory exists
if (!fs.existsSync(allureResultsDir)) {
  fs.mkdirSync(allureResultsDir, { recursive: true })
}

interface AllureTestResult {
  uuid: string
  historyId: string
  fullName: string
  testCaseId?: string
  labels: Array<{ name: string; value: string }>
  links: Array<{ name: string; url: string; type: string }>
  name: string
  status: "passed" | "failed" | "broken" | "skipped"
  statusDetails?: {
    known: boolean
    muted: boolean
    flaky: boolean
    message?: string
    trace?: string
  }
  stage: "finished"
  steps: Array<{
    name: string
    status: "passed" | "failed" | "broken" | "skipped"
    stage: "finished"
    start: number
    stop: number
    attachments?: Array<{
      name: string
      source: string
      type: string
    }>
  }>
  attachments: Array<{
    name: string
    source: string
    type: string
  }>
  start: number
  stop: number
}

/**
 * Create Allure test result from Cucumber scenario
 */
export function createAllureTestResult(
  scenario: any,
  screenshotPath?: string
): AllureTestResult {
  const testUuid = randomUUID()
  const scenarioName = scenario.pickle?.name || "Unknown Scenario"
  const featureName = scenario.gherkinDocument?.feature?.name || "Unknown Feature"
  const tags = scenario.pickle?.tags?.map((tag: any) => tag.name.replace("@", "")) || []
  const result = scenario.result
  
  // Debug logging
  if (process.env.CI || process.env.GITHUB_ACTIONS) {
    console.log(`Creating Allure result for: ${scenarioName}`)
    console.log(`  Feature: ${featureName}`)
    console.log(`  Status: ${result?.status || "unknown"}`)
    console.log(`  Steps count: ${scenario.pickle?.steps?.length || 0}`)
  }
  
  // Calculate duration properly (Cucumber returns duration in nanoseconds)
  let duration = 0
  if (result?.duration) {
    const durationNs = typeof result.duration === 'number' ? result.duration : parseInt(result.duration)
    if (!isNaN(durationNs) && durationNs > 0) {
      duration = durationNs
    }
  }
  
  const startTime = duration > 0 ? Date.now() - Math.round(duration / 1000000) : Date.now()
  const stopTime = Date.now()
  
  const status = result?.status === "PASSED" ? "passed" : 
                 result?.status === "FAILED" ? "failed" : 
                 result?.status === "SKIPPED" ? "skipped" : "broken"

  // Create steps from scenario steps
  const steps: AllureTestResult["steps"] = []
  if (scenario.pickle?.steps && scenario.pickle.steps.length > 0) {
    let stepStartTime = startTime
    const stepDuration = duration > 0 ? Math.round(duration / 1000000 / scenario.pickle.steps.length) : 1000
    
    scenario.pickle.steps.forEach((step: any, index: number) => {
      // Try to get step result from scenario result or use default
      const stepResult = step.result || {}
      let stepStatus: "passed" | "failed" | "broken" | "skipped" = "passed"
      
      // Determine step status
      if (stepResult.status) {
        stepStatus = stepResult.status === "PASSED" ? "passed" :
                     stepResult.status === "FAILED" ? "failed" :
                     stepResult.status === "SKIPPED" ? "skipped" : "broken"
      } else if (result?.status === "FAILED" && index === scenario.pickle.steps.length - 1) {
        // If scenario failed and this is the last step, mark it as failed
        stepStatus = "failed"
      } else {
        // Default to passed if no result
        stepStatus = "passed"
      }
      
      const stepStopTime = stepStartTime + stepDuration
      
      const stepKeyword = step.keyword || ""
      const stepText = step.text || ""
      const stepName = `${stepKeyword}${stepText}`.trim()
      
      steps.push({
        name: stepName,
        status: stepStatus,
        stage: "finished",
        start: stepStartTime,
        stop: stepStopTime,
      })
      
      stepStartTime = stepStopTime
    })
  } else {
    // If no steps, create a single step representing the scenario
    steps.push({
      name: scenarioName,
      status: status,
      stage: "finished",
      start: startTime,
      stop: stopTime,
    })
  }

  // Generate historyId and testCaseId from feature and scenario name (for history tracking)
  const historyId = `${featureName}:${scenarioName}`.replace(/[^a-zA-Z0-9]/g, "_")
  const testCaseId = historyId

  const testResult: AllureTestResult = {
    uuid: testUuid,
    historyId: historyId,
    testCaseId: testCaseId,
    fullName: `${featureName}: ${scenarioName}`,
    labels: [
      { name: "suite", value: featureName },
      { name: "testClass", value: scenarioName },
      { name: "framework", value: "cucumber" },
      { name: "language", value: "javascript" },
      { name: "package", value: featureName },
    ],
    links: [],
    name: scenarioName,
    status,
    stage: "finished",
    steps: steps,
    attachments: [],
    start: startTime,
    stop: stopTime,
  }

  // Add tags as labels
  tags.forEach((tag: string) => {
    testResult.labels.push({ name: "tag", value: tag })
  })

  // Add status details if failed
  if (status === "failed" || status === "broken") {
    const errorMessage = result?.message || "Test failed"
    testResult.statusDetails = {
      known: false,
      muted: false,
      flaky: false,
      message: errorMessage,
      trace: result?.message || "",
    }
  }

  // Add screenshot attachment if available
  if (screenshotPath && fs.existsSync(screenshotPath)) {
    const attachmentName = `${testUuid}-attachment.png`
    const attachmentPath = path.join(allureResultsDir, attachmentName)

    try {
      // Copy screenshot to allure-results
      fs.copyFileSync(screenshotPath, attachmentPath)

      testResult.attachments.push({
        name: "Screenshot on failure",
        source: attachmentName,
        type: "image/png",
      })
    } catch (error) {
      console.warn("Failed to copy screenshot to Allure results:", error)
    }
  }

  return testResult
}

/**
 * Write Allure test result to file
 */
export function writeAllureResult(testResult: AllureTestResult): void {
  const resultFile = path.join(allureResultsDir, `${testResult.uuid}-result.json`)
  try {
    const jsonContent = JSON.stringify(testResult, null, 2)
    fs.writeFileSync(resultFile, jsonContent)
    
    // Debug logging
    if (process.env.CI || process.env.GITHUB_ACTIONS) {
      console.log(`✅ Allure result created: ${resultFile}`)
      console.log(`   Name: ${testResult.name}`)
      console.log(`   Status: ${testResult.status}`)
      console.log(`   Steps: ${testResult.steps.length}`)
      console.log(`   File size: ${fs.statSync(resultFile).size} bytes`)
    } else {
      console.log(`Allure result created: ${resultFile}`)
    }
  } catch (error) {
    console.error("Failed to write Allure result:", error)
  }
}

/**
 * Create and write Allure test result for a scenario
 */
export function reportScenarioToAllure(scenario: any, screenshotPath?: string): void {
  try {
    if (!scenario) {
      console.warn("Cannot create Allure result: scenario is null or undefined")
      return
    }
    
    if (!scenario.pickle) {
      console.warn("Cannot create Allure result: scenario.pickle is missing")
      return
    }
    
    const testResult = createAllureTestResult(scenario, screenshotPath)
    
    // Validate test result before writing
    if (!testResult.uuid || !testResult.name || !testResult.status) {
      console.error("Invalid Allure test result:", {
        hasUuid: !!testResult.uuid,
        hasName: !!testResult.name,
        hasStatus: !!testResult.status,
      })
      return
    }
    
    writeAllureResult(testResult)
  } catch (error) {
    console.error("Failed to create Allure result:", error)
    if (error instanceof Error) {
      console.error("Error stack:", error.stack)
    }
  }
}

