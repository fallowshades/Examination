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
      return null // Return null or some error data
    }
  }

import { Link, Form } from 'react-router-dom'
import { useAppSelector } from '@/lib/hooks'
const Receipts = () => {
  const tenentName = useAppSelector((state) => state.tenantState.id) || 0

  return (
    <>
      <div className='mt-8 grid gap-8  lg:grid-cols-12 '>
        <div className='lg:col-span-8'>
          <p>f</p>
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <button className='btn'>lf</button>
          {tenentName ? (
            <Link
              to='/dashboard/checkout'
              className='btn btn-primary btn-block mt-8'
            >
              Proceed to checkout
            </Link>
          ) : (
            <Form
              method='post'
              action={`../checkout-action`}
            >
              <button
                type='submit'
                className='btn delete-btn black'
              >
                gör en ny beställning
              </button>
            </Form>
          )}
        </div>
      </div>
    </>
  )
}

export default Receipts
