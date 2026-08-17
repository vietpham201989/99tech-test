import { expect, Locator, Page } from "@playwright/test"

export class BasePage {
  protected page: Page

  constructor(page?: Page) {
    this.page = page ? page : ({} as Page)
  }

  setPage(page: Page) {
    this.page = page
    return this
  }

  async openLoginPage() {
    await this.navigate("/")
    await this.waitForPageLoaded(40000)
    return this
  }

  async waitForPageLoaded(timeout: number = 20000) {
    return await this.page.waitForLoadState("networkidle", {
      timeout: timeout,
    })
  }

  async waitForTimeout(timeout: number) {
    return this.page.waitForTimeout(timeout)
  }

  async waitForSelector(selector: string | Locator, timeout: number = 10000) {
    if (typeof selector === "string") {
      await this.page.waitForSelector(selector, {
        timeout: timeout,
        state: "attached",
      })
    } else {
      await selector.waitFor({ state: "attached", timeout: timeout })
    }
    return this
  }

  async waitForSelectorToBeVisible(
    selector: string | Locator,
    timeout: number = 10000
  ) {
    if (typeof selector === "string") {
      await this.page.waitForSelector(selector, {
        timeout: timeout,
        state: "visible",
      })
    } else {
      await selector.waitFor({ state: "visible", timeout: timeout })
    }
    return this
  }

  async navigate(url: string) {
    await this.page.goto(url)
    return this
  }

  async click(selector: string | Locator) {
    if (typeof selector === "string") {
      await this.page.click(selector, { force: true })
    } else {
      await selector.click({ force: true })
    }
    return this
  }

  async fill(selector: string | Locator, text: string) {
    if (typeof selector === "string") {
      await this.page.fill(selector, text)
    } else {
      await selector.fill(text)
    }
    return this
  }

  async selectRadioOption(selector: string | Locator) {
    if (typeof selector === "string") {
      await this.page.setChecked(selector, true, {
        force: true,
      })
    } else {
      await selector.setChecked(true, {
        force: true,
      })
    }
    return this
  }

  async isVisible(
    selector: string | Locator,
    timeout: number = 10000
  ): Promise<boolean> {
    if (typeof selector === "string") {
      return await this.page.isVisible(selector, {
        timeout: timeout,
      })
    }
    return await selector.isVisible({
      timeout: timeout,
    })
  }

  async pageShouldContainText(text: string, ignoreCase: boolean = false) {
    await expect(this.page.locator("body")).toContainText(text, {
      timeout: 10000,
      ignoreCase: ignoreCase,
    })
    return this
  }
}
