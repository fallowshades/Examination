import { redirect, type ActionFunction } from 'react-router-dom'
import customFetch from '@/utils/customFetch'

//import { type QueryClient } from '@tanstack/react-query'

import { ReduxStore } from '@/lib/store'
import { AxiosResponse, AxiosError } from 'axios'

export const action =
  (store: ReduxStore): ActionFunction =>
  async ({ request }) => {
    const { cartItems } = store.getState().menuState

    const info = {
      items: cartItems,
    }
    try {
      const settings = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          'x-zocom': 'yum-7BTxHCyHhzI',
        },
      }
      const tenant = 'a2f4'
      const response: Response = await fetch(
        `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenant}/orders`,
        settings
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      console.log('menu', data)

      return redirect('/receipts')
    } catch (error) {
      console.log(error)
      let errorMessage = 'There was an error placing your order'
      if (error instanceof AxiosError) {
        errorMessage = error?.response?.data?.error?.message || errorMessage
      }
      return null
    }
  }
