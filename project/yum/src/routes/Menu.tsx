//import customFetch from '@/utils/customFetch'
import { type ReduxStore } from '@/lib/store'
import { useLoaderData, type LoaderFunction } from 'react-router-dom'
import customFetch from '@/utils/customFetch'

interface Headers {
  Authorization: string
  'Content-Type': string
  'X-Tenant-Name'?: string // Optional property
}
import axios, { AxiosRequestConfig, AxiosHeaders } from 'axios'
export const loader =
  (store: ReduxStore): LoaderFunction =>
  async ({ request }: { request: Request }) => {
    console.log('Loader function started')

    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ])

    try {
      // const apiKey = 'yum-7BTxHCyHhzI' //store.getState().apiState.apiKey
      // const subdomain = 'a2f4' //|| window.location.hostname.split('.')[0] //C:\Windows\System32\drivers\etc\hosts // local dev env.
      // const tenant = store.getState().tenantState.name || subdomain
      // console.log(apiKey, tenant)
      //   const headers: Headers = new AxiosHeaders({
      //     Authorization: `Bearer ${apiKey}`,
      //     'Content-Type': 'application/json',
      //   })

      // // Initialize AxiosHeaders
      // const headers = new AxiosHeaders()

      // // Set common headers
      // headers.set('Authorization', `Bearer ${apiKey}`)
      // headers.set('Content-Type', 'application/json')
      // // {
      //         Authorization: `Bearer ${apiKey}`, // Include the API key in the Authorization header
      //         'Content-Type': 'application/json',
      //       }

      //   // If the tenant is required in headers, you can add it as well
      //   if (tenant) {
      //     //headers['X-Tenant-Name'] = tenant // Replace `X-Tenant-Name` with the actual tenant header key if needed
      //     headers.set('X-Tenant-Name', tenant)
      //   }

      //   const config: AxiosRequestConfig = {
      //     //type obj instead of obj literals in arguments
      //     headers,
      //   }
      // const params = { type: 'wonton' } // Example body data, adjust as needed
      //const { data } = await customFetch.post('/menu', params)
      // .then((response) => {
      //   console.log('Menu:', response.data)
      // })
      // .catch((error) => {
      //   console.error('Error fetching menu:', error)
      // })
      //   const { data } = await customFetch.post('/menu', {}, config)

      // Return the response data along with the parameters to pass to the component
      //return { ...data, params }
      //   // return { ...response.data, params }
      const settings = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
          'x-zocom': 'yum-7BTxHCyHhzI',
        },
      }

      const response: Response = await fetch(
        'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu',
        settings
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      console.log('menu', data)
      return { data }
    } catch (error) {
      console.error('Error fetching menu:', error)
      return null // Return null or some error data
    }
    return null
  }
import { MenuItem } from '@/utils/types'
import SharedCardLayout from '@/components/SharedCardLayout'
// import { transformData } from '@/utils/transformations'

const Menu = () => {
  const { data } = useLoaderData() as { data: { items: MenuItem[] } }
  console.log('menu', data)
  // Combine all items into one array
  const allItems = ['wonton', 'dip', 'drink'].map((type) => ({
    type,
    items: data.items.filter((item) => item.type === type),
  }))

  return (
    <section className=''>
      <h2 className='item-info'>Menu</h2>
      <div className=''>
        {/* Render all items in a single loop */}
        {allItems.map(({ type, items }) => (
          <div
            key={type}
            className='menu-space'
          >
            {/* <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3> */}
            <SharedCardLayout
              items={items}
              type={type}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Menu
