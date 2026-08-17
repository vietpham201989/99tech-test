import { Locator, Page } from "@playwright/test"
import { BasePage } from "./basePage"

export class AboutusPage extends BasePage {
  readonly title: Locator

  constructor(page?: Page) {
    super(page)
    this.title = this.page.locator("#videoModalLabel")
  }

  async showAboutPopup(time?: number): Promise<boolean> {
    return await this.isDisplayed(this.title, time)
  }
}
