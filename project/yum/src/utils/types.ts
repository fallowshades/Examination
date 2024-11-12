export type CartItem = {
  cartID: string
  productID: number
  image: string
  title: string
  price: string
  amount: number
  productColor: string
  company: string
}

export type MappedCartItem = {
  cartItem: CartItem
}

export type CartState = {
  //   id: number
  cartItems: CartItem[]
  //products: CartItem[] (refracture from)
  //   numItemsInCart: number
  //   cartTotal: number
  //   shipping: number
  //   tax: number
  //   orderTotal: number
}
/////////

export type MenuItem = {
  id: number
  type: string ///
  name: string
  description: string
  price: number
  ingredients: string[]
}

export type Orders = {
  id: string
  orderValue: number
  timestamp: string
  items: MenuItem[]
}

export type Receipts = {
  id: string
  orderValue: number
  timestamp: string
  items: MenuItem[]
}
