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
      //   const apiKey = store.getState().apiState.apiKey
      //   const subdomain = '9oxx' //|| window.location.hostname.split('.')[0] //C:\Windows\System32\drivers\etc\hosts // local dev env.
      //   const tenant = store.getState().tenantState.name || subdomain
      //   console.log(apiKey, tenant)
      //   //   const headers: Headers = new AxiosHeaders({
      //   //     Authorization: `Bearer ${apiKey}`,
      //   //     'Content-Type': 'application/json',
      //   //   })

      //   // Initialize AxiosHeaders
      //   const headers = new AxiosHeaders()

      //   // Set common headers
      //   headers.set('Authorization', `Bearer ${apiKey}`)
      //   headers.set('Content-Type', 'application/json')
      //   // {
      //   //         Authorization: `Bearer ${apiKey}`, // Include the API key in the Authorization header
      //   //         'Content-Type': 'application/json',
      //   //       }

      //   // If the tenant is required in headers, you can add it as well
      //   if (tenant) {
      //     //headers['X-Tenant-Name'] = tenant // Replace `X-Tenant-Name` with the actual tenant header key if needed
      //     headers.set('X-Tenant-Name', tenant)
      //   }

      //   const config: AxiosRequestConfig = {
      //     //type obj instead of obj literals in arguments
      //     headers,
      //   }
      const params = { type: 'wonton' } // Example body data, adjust as needed
      const { data } = await customFetch.post('/menu', params)
      //   const { data } = await customFetch.post('/menu', {}, config)
      console.log(data)
      // Return the response data along with the parameters to pass to the component
      return { ...data, params }
      //   // return { ...response.data, params }
      return true
    } catch (error) {
      console.error('Error fetching menu:', error)
      return null // Return null or some error data
    }
    return null
  }

const Menu = () => {
  return <div>Menu</div>
}

export default Menu
