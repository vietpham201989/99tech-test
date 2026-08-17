import { Locator, Page } from "@playwright/test"
import { BasePage } from "./basePage"

export class AccountPage extends BasePage {
  readonly loginLink: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly nameOfUser: Locator
  readonly usernameSignupInput: Locator
  readonly passSignupInput: Locator
  readonly signUpButton: Locator

  constructor(page?: Page) {
    super(page)
    // login
    this.loginLink = this.page.locator("#login2")
    this.usernameInput = this.page.locator("#loginusername")
    this.passwordInput = this.page.locator("#loginpassword")
    this.loginButton = this.page.locator('button:has-text("Log in")')
    this.nameOfUser = this.page.locator("#nameofuser")
    // sign up
    this.usernameSignupInput = this.page.locator("#sign-username")
    this.passSignupInput = this.page.locator("#sign-password")
    this.signUpButton = this.page.locator('button:has-text("Sign up")')
  }

  async openLoginModal() {
    await this.click(this.loginLink)
    await this.waitForSelectorToBeVisible(this.usernameInput)
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

  async showLoginPopup(time?: number): Promise<boolean> {
    return await this.isDisplayed(this.usernameInput, time)
  }

  //sign up
  async signup(username: string, password: string) {
    await this.usernameSignupInput.fill(username)
    await this.passSignupInput.fill(password)
    await this.delay(2000)
    await this.click(this.signUpButton)
  }

  async showSignupPopup(time?: number): Promise<boolean> {
    return await this.isDisplayed(this.usernameSignupInput, time)
  }
}
