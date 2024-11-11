import {
  Outlet,
  useLoaderData,
  useNavigation,
  redirect,
} from 'react-router-dom'

import { createContext, useContext } from 'react'
import Loading from '@/components/Loading'
import Navbar from '@/components/Navbar'
import customFetch from '@/utils/customFetch'
export const loader = () => async () => {
  try {
    const { data } = await customFetch.get('/keys')
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
    return redirect('/')
  }
}
const DashboardContext = createContext(undefined)
const tenants = useLoaderData()
console.log(tenants)
const Layout = () => {
  const navigation = useNavigation()
  const isPageLoading = navigation.state === 'loading'

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
