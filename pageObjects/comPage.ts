import { Locator, Page, expect } from "@playwright/test"
import { BasePage } from "./basePage"
import { String } from "typescript-string-operations"
import {
  HeaderMenu,
  CategoriesMenu,
  PreNext,
  IconTable,
} from "../helpers/constants"

export class ComPage extends BasePage {
  readonly menuHeader: string
  readonly menuCategories: string
  readonly preOrNext: string
  readonly loginLink: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly nameOfUser: Locator
  readonly headerCell: string
  readonly bodyRow: string
  readonly xPopup: Locator
  readonly closeBtn: Locator
  readonly sweetAlert: string

  constructor(page?: Page) {
    super(page)
    this.menuHeader = `//*[@id='navbarExample']//*[contains(text(),'{0}')]`
    this.menuCategories = `//*[@id='cat']/following-sibling::a[contains(text(),'{0}')]`
    this.preOrNext = `//*[@class='pagination']//button[text()='{0}']`
    this.loginLink = this.page.locator("#login2")
    this.usernameInput = this.page.locator("#loginusername")
    this.passwordInput = this.page.locator("#loginpassword")
    this.loginButton = this.page.locator('button:has-text("Log in")')
    this.nameOfUser = this.page.locator("#nameofuser")
    this.headerCell = `//thead//th`
    this.bodyRow = `//tbody/tr`
    this.xPopup = this.page.locator(
      `//*[contains(@class,'show')]//button/span[text()='×']`
    )
    this.closeBtn = this.page.locator(
      `//*[contains(@class,'show')]//button[text()="Close"]`
    )
    this.sweetAlert = `//*[contains(@class,'showSweetAlert')]`
  }

  async selectHeaderMenu(menu: HeaderMenu) {
    await this.delay(2000)
    const loc = this.page.locator(String.format(this.menuHeader, menu))
    await this.click(loc)
    return this
  }

  async selectCategoriesMenu(menu: CategoriesMenu) {
    await this.delay(2000)
    const loc = this.page.locator(String.format(this.menuCategories, menu))
    await this.click(loc)
    return this
  }

  async prevOrNextPage(preOrNext: PreNext) {
    const loc = this.page.locator(String.format(this.preOrNext, preOrNext))
    await this.click(loc)
    return this
  }

  async countTable() {
    await this.delay(3000)
    return await this.count(this.page.locator(this.bodyRow))
  }

  async getTable(limit?: number, timeout: number = 5000) {
    await this.delay(timeout)
    const header = new Array()
    const body = new Array()
    const headerCount = await this.count(this.page.locator(this.headerCell))
    for (let i = 1; i <= headerCount; i++) {
      const loc = `${this.headerCell}[${i}]`
      let text = await this.getText(loc)
      header.push(text)
    }
    let rowCount = await this.count(this.page.locator(this.bodyRow))
    if (limit) {
      rowCount = limit < rowCount ? limit : rowCount
    }
    for (let i = 1; i <= rowCount; i++) {
      const cellsLoc = `${this.bodyRow}[${i}]/td`
      const cellsCount = await this.count(this.page.locator(cellsLoc))
      const rowArr = new Array()
      for (let j = 1; j <= cellsCount; j++) {
        const textLoc = `${cellsLoc}[${j}]`
        let text: any = ""
        if (await this.isDisplayed(textLoc)) {
          text = await this.getText(textLoc)
        }
        rowArr.push(text)
      }
      body.push(rowArr)
    }

    return {
      header,
      body,
    }
  }

  async formatTable<T>(limit?: number, timeout?: number) {
    const tableData = await this.getTable(limit, timeout)
    const header = tableData.header
    const body = tableData.body
    if (body.length > 0) {
      const formattedData: T[] = body.map((row) => {
        const rowData: any = {} as T
        header.forEach((column, index) => {
          rowData[column] = row[index]
        })
        return rowData
      })
      console.log(formattedData)
      return formattedData
    } else {
      console.log(`Table data []`)
      return []
    }
  }

  async clickIconInTable(
    column: string,
    nameIcon: IconTable,
    rowNumber: number
  ) {
    let iconLoc = ""
    switch (nameIcon) {
      case IconTable.delete:
        iconLoc = `a[text()='${nameIcon}']`
        break
    }
    const header = (await this.getTable(0, 500)).header
    const colIdex = header.indexOf(column) + 1
    const icon = `${this.bodyRow}[${rowNumber}]/td[${colIdex}]/${iconLoc}`

    try {
      await this.click(icon)
      return true
    } catch (error) {
      return false
    }
  }

  async getLocText(text: string, contains: boolean = false) {
    let locatorText = '//*[text()="{0}"]'
    if (contains) {
      locatorText = '//*[contains(text(),"{0}")]'
    }
    return String.format(locatorText, text)
  }

  async isText(
    text: string,
    contains: boolean = false,
    timeout: number = 10000
  ) {
    let loc = await this.getLocText(text, contains)
    return await this.isDisplayed(loc, timeout)
  }

  async tapText(text: string, contains: boolean = false) {
    let loc = await this.getLocText(text, contains)
    return await this.click(loc)
  }

  async closePopup(type: string = "icon") {
    await this.delay(2000)
    if (type == "closeBtn") {
      await this.click(this.closeBtn)
    } else {
      await this.click(this.xPopup)
    }
  }

  async expectAlert(page: any, text: string, timeout = 10000) {
    const dialog = await page.waitForEvent("dialog", { timeout })
    expect(dialog.message()).toContain(text)
    await dialog.accept()
  }

  async getSweetAlert() {
    const titleLoc = `${this.sweetAlert}//h2`
    const detailsLoc = `${this.sweetAlert}//p`
    const title = await this.getText(titleLoc)
    const details = await this.getText(detailsLoc)
    return { title, details }
  }
}
