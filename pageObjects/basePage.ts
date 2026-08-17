import { expect, Locator, Page } from "@playwright/test"
const time = 10000
export class BasePage {
  protected page: Page

  constructor(page?: Page) {
    this.page = page ? page : ({} as Page)
  }

  setPage(page: Page) {
    this.page = page
    return this
  }

  getPage() {
    return this.page
  }

  getLoc(selector: string | Locator) {
    return typeof selector === "string" ? this.page.locator(selector) : selector
  }

  async openLoginPage() {
    await this.navigate("/")
    // await this.waitForPageLoaded(40000)
    return this
  }

  async waitForPageLoaded(timeout: number = 20000) {
    return await this.page.waitForLoadState("networkidle", {
      timeout: timeout,
    })
  }
  async delay(ms: number = 2000) {
    return await this.waitForTimeout(ms)
  }

  async waitForTimeout(timeout: number) {
    return this.page.waitForTimeout(timeout)
  }

  async waitForSelector(selector: string | Locator, timeout: number = time) {
    const loc = this.getLoc(selector)
    await loc.waitFor({ state: "attached", timeout: timeout })
    return this
  }

  async waitForSelectorToBeVisible(
    selector: string | Locator,
    timeout: number = time
  ) {
    const loc = this.getLoc(selector)
    await loc.waitFor({ state: "visible", timeout: timeout })
    return this
  }

  async navigate(url: string) {
    await this.page.goto(url)
    return this
  }

  async click(selector: string | Locator, timeout: number = time) {
    const loc = this.getLoc(selector)
    await loc.waitFor({ state: "visible", timeout })
    await loc.click({ force: true })
    return this
  }

  async count(selector: string | Locator) {
    const loc = this.getLoc(selector)
    return await loc.count()
  }

  async fill(selector: string | Locator, text: string, timeout: number = time) {
    const loc = this.getLoc(selector)
    await loc.waitFor({ state: "visible", timeout })
    await loc.fill(text)
    return this
  }

  async getAttr(selector: string, attribute: string, timeout: number = time) {
    const loc = this.getLoc(selector)
    return await loc.getAttribute(attribute, { timeout: timeout })
  }

  async getText(selector: string | Locator, timeout: number = time) {
    const loc = this.getLoc(selector)
    await loc.waitFor({ state: "visible", timeout })
    return await loc.textContent()
  }

  async selectRadioOption(selector: string | Locator, timeout: number = time) {
    const loc = this.getLoc(selector)
    await loc.waitFor({ state: "visible", timeout })
    await loc.setChecked(true, { force: true })
    return this
  }

  async isVisible(
    selector: string | Locator,
    timeout: number = time
  ): Promise<boolean> {
    const loc = this.getLoc(selector)
    return await loc.isVisible({ timeout: timeout })
  }

  async isDisplayed(
    selector: string | Locator,
    timeout: number = time
  ): Promise<boolean> {
    const loc = this.getLoc(selector)
    return loc
      .first()
      .waitFor({ timeout: timeout })
      .then(() => true)
      .catch(() => false)
  }

  async pageShouldContainText(text: string, ignoreCase: boolean = false) {
    await expect(this.page.locator("body")).toContainText(text, {
      timeout: time,
      ignoreCase: ignoreCase,
    })
    return this
  }

  async clickPoint(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y)
    await this.page.mouse.click(x, y)
  }
}
