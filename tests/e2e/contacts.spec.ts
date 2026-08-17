import { test, expect } from "../fixtures"
import { ComPage } from "../../pageObjects/comPage"
import { ContactPage } from "../../pageObjects/contactPage"
import { HeaderMenu, MessageInfo } from "../../helpers/constants"
import ui from "../../data/e2e/ui_data.json"

const alert = ui.alert
const data: MessageInfo = {
  contactEmail: "nguyenvana@gmail.com",
  contactName: "nguyenvana",
  message: "Hello!",
}

test.describe("Contact", { tag: ["@e2e", "@regression", "@login"] }, () => {
  let comPage: ComPage
  let contactPage: ContactPage

  test.beforeEach(async ({ page }) => {
    comPage = new ComPage(page)
    contactPage = new ContactPage(page)
    await comPage.openLoginPage()
  })

  test("Submit contact form with valid data", async ({ page }) => {
    await comPage.selectHeaderMenu(HeaderMenu.contact)
    const alertPromise = comPage.expectAlert(page, alert.addMsgSuccess)
    await contactPage.newMessage(data)
    await alertPromise
  })
  // Skip this because the application is under development.
  test.skip("Submit contact form without email", async ({ page }) => {
    const dataWithoutEmail = { ...data }
    dataWithoutEmail.contactEmail = ""
    await comPage.selectHeaderMenu(HeaderMenu.contact)
    const alertPromise = comPage.expectAlert(page, alert.addMsgSuccess)
    await contactPage.newMessage(dataWithoutEmail)
    await alertPromise
  })

  // Skip this because the application is under development.
  test.skip("Submit contact form invalid email", async ({ page }) => {
    const dataInvalidEmail = { ...data }
    dataInvalidEmail.contactEmail = "nguyenvana"
    await comPage.selectHeaderMenu(HeaderMenu.contact)
    const alertPromise = comPage.expectAlert(page, alert.addMsgSuccess)
    await contactPage.newMessage(dataInvalidEmail)
    await alertPromise
  })

  // Skip this because the application is under development.
  test.skip("Submit contact form without name", async ({ page }) => {
    const dataWithoutName = { ...data }
    dataWithoutName.contactName = ""
    await comPage.selectHeaderMenu(HeaderMenu.contact)
    const alertPromise = comPage.expectAlert(page, alert.addMsgSuccess)
    await contactPage.newMessage(dataWithoutName)
    await alertPromise
  })

  // Skip this because the application is under development.
  test.skip("Submit contact form without message", async ({ page }) => {
    const dataWithoutMsg = { ...data }
    dataWithoutMsg.message = ""
    await comPage.selectHeaderMenu(HeaderMenu.contact)
    const alertPromise = comPage.expectAlert(page, alert.addMsgSuccess)
    await contactPage.newMessage(dataWithoutMsg)
    await alertPromise
  })

  test("Close Contact popup", async () => {
    await comPage.selectHeaderMenu(HeaderMenu.contact)
    expect(await contactPage.showContactPopup()).toBe(true)
    await comPage.closePopup("closeBtn")
    await comPage.delay(3000)
    expect(await contactPage.showContactPopup(2000)).toBe(false)
  })
})
