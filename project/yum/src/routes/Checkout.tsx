//import customFetch from '@/utils/customFetch'
import { type ReduxStore } from '@/lib/store'
import { useLoaderData, type LoaderFunction } from 'react-router-dom'

export const loader =
  (store: ReduxStore): LoaderFunction =>
  async ({ request }: { request: Request }) => {
    console.log('Loader function started')
    const user = store.getState()
    console.log(user)
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ])
    console.log('params', params)

    const type = params.type || ''
    // Construct the URL based on the 'type'
    const url = `/menu${type ? `?type=${type}` : ''}`
    const API_URL = 'http://localhost:3000/api/menu'
    const API_KEY = 'fallow'
    try {
      // const response = await customFetch<MenuItemsResponse>(url)
      const response = await fetch(`${API_URL}${type ? `?type=${type}` : ''}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-zocom': API_KEY,
        },
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      // Parse JSON data
      const data = await response.json()
      console.log(data)
      // Return the response data along with the parameters to pass to the component
      return { ...data, params }
      // return { ...response.data, params }
      return true
    } catch (error) {
      console.error('Error fetching menu:', error)
      return {
        id: '3023b0f5',
        items: [
          {
            id: 1,
            type: 'wonton',
            name: 'Karlstad',
            description:
              'En god friterad wonton med smaker från de värmländska skogarna.',
            price: 129,
            ingredients: ['kål', 'morot', 'salladslök'],
          },
          {
            id: 12,
            type: 'dip',
            name: 'Chili Mayo',
            description: 'Egengjord majonäs smaksatt med chili.',
            price: 129,
          },
          {
            id: 15,
            type: 'drink',
            name: 'Sprite',
            description: 'Drink ipsum dolor fizzy, fruity & Sweet...',
            price: 19,
          },
        ],
        orderValue: 387,
        eta: 10,
        timestamp: '2024-12-24T13:37:00',
        state: 'waiting',
      } // Return null or some error data
    }
  }

const Checkout = () => {
  return <div>Checkout</div>
}

export default Checkout
