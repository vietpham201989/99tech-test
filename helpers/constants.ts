export enum HeaderMenu {
  home = "Home",
  contact = "Contact",
  aboutUs = "About us",
  login = "Log in",
  signUp = "Sign up",
  cart = "Cart",
  logout = "Log out",
}

export enum CategoriesMenu {
  phone = "Phones",
  laptops = "Laptops",
  monitors = "Monitors",
}

export enum PreNext {
  previous = "Previous",
  next = "Next",
}

export enum IconTable {
  delete = "Delete",
}

export interface OrdersInfo {
  name?: string
  country?: string
  city?: string
  creditCard?: string
  month?: string
  year?: string
}

export interface MessageInfo {
  contactEmail?: string
  contactName?: string
  message?: string
}
