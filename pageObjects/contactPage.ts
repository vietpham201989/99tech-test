import { Locator, Page } from "@playwright/test"
import { BasePage } from "./basePage"
import { MessageInfo } from "../helpers/constants"

export class ContactPage extends BasePage {
  readonly sendMessageBtn: Locator
  readonly closeBtn: Locator
  readonly emailInput: Locator
  readonly nameInput: Locator
  readonly messageInput: Locator

  constructor(page?: Page) {
    super(page)
    this.sendMessageBtn = this.page.locator(`//button[text()='Send message']`)
    this.closeBtn = this.page.locator(`//button[text='Close']`)
    this.emailInput = this.page.locator(`//input[@id="recipient-email"]`)
    this.nameInput = this.page.locator(`//input[@id="recipient-name"]`)
    this.messageInput = this.page.locator(`//textarea[@id="message-text"]`)
  }

  async showContactPopup(time?: number): Promise<boolean> {
    return await this.isDisplayed(this.emailInput, time)
  }

  async newMessage(msg: MessageInfo) {
    await this.fill(this.emailInput, msg.contactEmail || "")
    await this.fill(this.nameInput, msg.contactName || "")
    await this.fill(this.messageInput, msg.message || "")
    await this.delay(3000)
    await this.click(this.sendMessageBtn)
  }
}
