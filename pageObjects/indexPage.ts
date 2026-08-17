import { Locator, Page } from "@playwright/test"
import { BasePage } from "./basePage"

export class IndexPage extends BasePage {
  readonly loginLink: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly nameOfUser: Locator

  constructor(page?: Page) {
    super(page)
    this.loginLink = this.page.locator("#login2")
    this.usernameInput = this.page.locator("#loginusername")
    this.passwordInput = this.page.locator("#loginpassword")
    this.loginButton = this.page.locator('button:has-text("Log in")')
    this.nameOfUser = this.page.locator("#nameofuser")
  }

  async openLoginModal() {
    await this.click(this.loginLink)
    await this.waitForSelectorToBeVisible(this.usernameInput)
    await this.waitForPageLoaded()
    return this
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.click(this.loginButton)
    return this
  }

  async verifyUserLoggedIn(username: string): Promise<boolean> {
    await this.waitForSelectorToBeVisible(this.nameOfUser, 20000)
    const displayedUsername = await this.nameOfUser.textContent()
    return displayedUsername?.trim() === `Welcome ${username}`
  }
}
