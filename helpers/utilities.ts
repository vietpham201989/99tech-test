export function priceTotalCart(cartData: any) {
  let total = 0
  for (let i = 0; i < cartData.length; i++) {
    const e = cartData[i]
    const price = e["Price"]
    total += parseInt(price)
  }
  return total
}
