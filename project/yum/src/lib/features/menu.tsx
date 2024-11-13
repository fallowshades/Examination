import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { type CartItem, type CartState } from '@/utils/types'
const defaultState: CartState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  //   shipping: 500,
  //   tax: 0,
  //   orderTotal: 0,
}

const getCartFromLocalStorage = (): CartState => {
  const cart = localStorage.getItem('menu-tenant')
  return cart ? JSON.parse(cart) : defaultState
}
const menuSlice = createSlice({
  name: 'menu-tenant',
  initialState: getCartFromLocalStorage,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      //const { product } = action.payload
      const newCartItem = action.payload
      const item = state.cartItems.find((i) => i.cartID === newCartItem.cartID)
      if (item) {
        item.amount += newCartItem.amount
      } else {
        state.cartItems.push(newCartItem)
      }
      state.numItemsInCart += newCartItem.amount
      state.cartTotal += Number(newCartItem.price) * newCartItem.amount
      menuSlice.caseReducers.calculateTotals(state)
      localStorage.setItem('menu-tenant', JSON.stringify(state))
    },
    calculateTotals: (state) => {
      //   state.tax = 0.1 * state.cartTotal
      //   state.orderTotal = state.cartTotal + state.shipping + state.tax
      localStorage.setItem('menu-tenant', JSON.stringify(state))
    },
    clearCart: (state) => {
      localStorage.setItem('menu-tenant', JSON.stringify(defaultState))
      return defaultState
    },

    removeItem: (state, action: PayloadAction<string>) => {
      //const { cartID } = action.payload
      const cartID = action.payload

      const product = state.cartItems.find((i) => i.cartID === cartID)
      if (!product) return
      state.cartItems = state.cartItems.filter((i) => i.cartID !== cartID)

      state.numItemsInCart -= product.amount
      state.cartTotal -= Number(product.price) * product.amount
      menuSlice.caseReducers.calculateTotals(state)
    },
    editItem: (
      state,
      action: PayloadAction<{ cartID: string; amount: number }>
    ) => {
      const { cartID, amount } = action.payload
      const item = state.cartItems.find((i) => i.cartID === cartID)
      if (!item) return
      state.numItemsInCart += amount - item.amount
      state.cartTotal += Number(item.price) * (amount - item.amount)
      item.amount = amount
      menuSlice.caseReducers.calculateTotals(state)
    },
    handleItemQuantityChange: (
      state,
      action: PayloadAction<{
        cartID: string
        changeType: 'increment' | 'decrement'
      }>
    ) => {
      const { cartID, changeType } = action.payload
      const item = state.cartItems.find((i) => i.cartID === cartID)
      if (!item) return

      const newAmount =
        changeType === 'increment' ? item.amount + 1 : item.amount - 1

      // Prevent quantity from going below 1
      if (newAmount < 1) {
        // If quantity goes to 0, remove the item
        state.cartItems = state.cartItems.filter((i) => i.cartID !== cartID)
        state.numItemsInCart -= item.amount
        state.cartTotal -= Number(item.price) * item.amount
      } else {
        // Otherwise, update the item's amount
        state.numItemsInCart += changeType === 'increment' ? 1 : -1
        state.cartTotal +=
          Number(item.price) * (changeType === 'increment' ? 1 : -1)
        item.amount = newAmount
      }

      // Recalculate totals after the change
      menuSlice.caseReducers.calculateTotals(state)
      localStorage.setItem('menu-tenant', JSON.stringify(state))
    },
  },
})

export const {
  addItem,
  removeItem,
  editItem,
  clearCart,
  handleItemQuantityChange,
} = menuSlice.actions

export default menuSlice.reducer

// export const handleItemQuantityChange =
//   (cartID: string, changeType: 'increment' | 'decrement') =>
//   (
//     dispatch: any, // Assuming you have access to `dispatch` here (e.g., in a thunk)
//     getState: any
//   ) => {
//     const state = getState()
//     console.log(state)

//     const item = state.menu.cartItems.find((i: any) => i.cartID === cartID)
//     console.log(item)

//     if (!item) return
//     const newAmount =
//       changeType === 'increment' ? item.amount + 1 : item.amount - 1
//     console.log(newAmount)
//     // Prevent quantity from going below 1
//     if (newAmount < 1) {
//       dispatch(removeItem(cartID)) // Removes item if quantity goes to 0
//     } else {
//       dispatch(editItem({ cartID, amount: newAmount })) // Updates amount in state
//     }
//   }
