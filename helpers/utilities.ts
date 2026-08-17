import { OrdersInfo } from "../helpers/constants"
import { faker } from "@faker-js/faker"

export function generateFakeOrdersInfo(): OrdersInfo {
  return {
    name: faker.person.fullName(),
    country: faker.location.country(),
    city: faker.location.city(),
    creditCard: faker.finance.creditCardNumber(),
    month: String(faker.number.int({ min: 1, max: 12 })),
    year: String(faker.number.int({ min: 2025, max: 2035 })),
  }
}

export function priceTotalCart(cartData: any) {
  let total = 0
  for (let i = 0; i < cartData.length; i++) {
    const e = cartData[i]
    const price = e["Price"]
    total += parseInt(price)
  }
  return total
}
