import {
  Outlet,
  useLoaderData,
  useNavigation,
  redirect,
  type LoaderFunction,
} from 'react-router-dom'

import { createContext, useContext } from 'react'
import Loading from '@/components/Loading'
import Navbar from '@/components/Navbar'
import customFetch from '@/utils/customFetch'
import { ReduxStore } from '@/lib/store'

import { setApiKey } from '@/lib/features/apiKeySlice'
import { setTenant } from '@/lib/features/tenantSlice'
export const loader =
  (store: ReduxStore): LoaderFunction =>
  async () => {
    try {
      console.log('layout loader')
      const apiKey = store.getState().apiState.apiKey
      console.log('api key', apiKey)
      if (!apiKey) {
        //!apiKey
        console.log('api key', apiKey)
        const { data } = await customFetch.post('/keys') //should crud manage, post is basically get
        //yum-7BTxHCyHhzIME5TI
        if (data?.key) {
          store.dispatch(setApiKey(data.key))
        }
      }
      //ONboarding
      //1. multi-tenant application, single-tenannt application, session-based tenant creation
      // const tenant = store.getState().tenantState.id
      // if (!tenant) {
      //   console.log('tenant', tenant)
      //   const body = { name: 'erik.jonsson@chassacademy.se' }
      //   const { data } = await customFetch.post('/tenants', body) //no need batch
      //   //console.log(data)
      //   if (data?.key) {
      //     store.dispatch(setTenant({ name: data.name, id: data.id }))
      //   }
      // }
      //200,401,404, need access key

      return null
    } catch (error) {
      console.log(error)
      return null
    }
  }
const DashboardContext = createContext(undefined)
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
//import { useEffect } from 'react'
const Layout = () => {
  //   useEffect(() => {
  //     const subdomain = window.location.hostname.split('.')[0]
  //     const isLocalhost = window.location.hostname === 'localhost'

  //     // Check if we're on the correct subdomain or on localhost (for development)
  //     if (subdomain !== 'zocom' && !isLocalhost) {
  //       // Redirect to the `zocom` subdomain
  //       const newHostname = `zocom.${window.location.hostname
  //         .split('.')
  //         .slice(1)
  //         .join('.')}`
  //       window.location.replace(
  //         `${window.location.protocol}//${newHostname}${window.location.pathname}`
  //       )
  //     }
  //   }, [])

  const navigation = useNavigation()
  const isPageLoading = navigation.state === 'loading'

  const tenants = useLoaderData()

  const location = useLocation()

  const checkDefaultTheme = () => {
    const isDefaultPath = location.pathname === '/'
    //const primaryTheme = localStorage.getItem('theme') === 'true'

    if (isDefaultPath) {
      document.body.classList.toggle('primary-theme')
      document.body.classList.remove('secondary-theme')
    } else if (location.pathname.startsWith('/checkout/')) {
      document.body.classList.remove('secondary-theme')
      document.body.classList.remove('primary-theme')
    } else if (location.pathname.startsWith('/receipt')) {
      document.body.classList.add('secondary-theme')
      document.body.classList.remove('primary-theme')
    }

    // return primaryTheme
  }

  const [sePrimaryTheme, setTheme] = useState(checkDefaultTheme())

  useEffect(() => {
    checkDefaultTheme()
  }, [location.pathname])

  return (
    <DashboardContext.Provider value={undefined}>
      <div>
        <main className='dashboard'>
          <div>
            <Navbar />
            <div className='dashboard-page'>
              {isPageLoading ? <Loading /> : <Outlet context={{ tenants }} />}
            </div>
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error(
      'useDashboardContext must be used within a DashboardContextProvider'
    )
  }
  return context
}

export default Layout
