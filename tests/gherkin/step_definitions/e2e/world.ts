import { Browser, BrowserContext, Page } from "@playwright/test"
import { AccountPage } from "../../../../pageObjects/accountPage"
import { CartPage } from "../../../../pageObjects/cartPage"
import { ProductPage } from "../../../../pageObjects/productPage"
import { IndexPage } from "../../../../pageObjects/indexPage"
import { ComPage } from "../../../../pageObjects/comPage"
import { CartFlow } from "../../../../pageObjects/flow/cartFlow"

export class World {
  browser!: Browser
  context!: BrowserContext
  page!: Page
  comPage!: ComPage
  accountPage!: AccountPage
  cartPage!: CartPage
  productPage!: ProductPage
  indexPage!: IndexPage
  cartFlow!: CartFlow
}

export const world = new World()

