Install your React app here.

tsconfig.json

```json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "ES2020"],
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

index.html

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>
```

store.tsx

- rootstate where we getstate or dispatch to local endpoint (syncronous)

main.tsx

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { store } from '@/lib/store'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
```

App.tsx

- NoMatch, SectionBoundary

```tsx
import './App.css'
import Menu, { loader as MenuLoader } from './routes/Menu'
import Checkout, { loader as CheckoutLoader } from './routes/Checkout'
import Receipts, { loader as ReceiptsLoader } from './routes/Receipts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { store } from './lib/store'
import NoMatch from './routes/NoMatch'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />,
    loader: MenuLoader(store),

    children: [
      {
        index: true,
        element: <Menu />,
        loader: MenuLoader(store),
      },
      {
        path: 'checkout:id',
        element: <Checkout />,
        loader: CheckoutLoader(store),
      },
      {
        path: 'receipts',
        element: <Receipts />,
        loader: ReceiptsLoader(store),
      },
      {
        path: '*', // Catch-all route
        element: <NoMatch />,
      },
    ],
  },
])
function App() {
  return (
    <RouterProvider
      router={router}
      // future={{
      //   v7_normalizeFormMethod: true,
      //   v7_partialHydration: true,
      // }}
    />
  )
}

export default App
```

- prepare loader Builder pattern --> extra reducers

Checkout.tsx
Menu.tsx
Receipt.tsx

#### loading of data

customFetch.tsx

```tsx
import axios from 'axios'
const customFetch = axios.create({
  baseURL: 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com',
})

export default customFetch
```

```tsx
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

//no linear equation

export type CartState = {
  cartItems: CartItem[]
  //products: CartItem[] (refracture from)
  //   numItemsInCart: number
  //   cartTotal: number
  //   shipping: number
  //   tax: number
  //   orderTotal: number
}
/////////

export type Menu = {
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
  items: Menu[]
}

export type Receipts = {
  id: string
  orderValue: number
  timestamp: string
  items: Menu[]
}
```

#### layout multiple tenants

Layout.tsx

```tsx
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
```

#### load data

Layout

```

```

Menu

Checkout

Receipts

##### api key wo tenant

App.tsx

- update loader

```tsx
import Layout, { loader as layoutLoader } from './routes/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    loader: layoutLoader(store),

    children: [
```

apiKeySlice.tsx

- use transitional store instead of context. which is better?

```tsx
type ApiKeyState = {
  apiKey: string | null

}

initialState: getApiKeyFromLocalStorage,
  reducers: {
    setApiKey(state, action: PayloadAction<string>) {
      state.apiKey = action.payload
      localStorage.setItem('tenant', JSON.stringify(state))
    },

    clearApiKey(state) {
      // state.apiKey = null
      localStorage.setItem('tenant', JSON.stringify(initialApiKeyState))
```

tenantSlice.tsx

```tsx
type TenantState = {
  id: string | null
  name: string | null
  createdAt: string | null
}

// Initial state for tenants
const initialState: TenantState = {
  id: null,
  name: null,
  createdAt: null,
}

const getTenantFromLocalStorage = (): TenantState => {
  const tenant = localStorage.getItem('tenant')
  return tenant ? JSON.parse(tenant) : initialState
}
```

menu.tsx

```tsx
import customFetch from '@/utils/customFetch'

interface Headers {
  Authorization: string
  'Content-Type': string
  'X-Tenant-Name'?: string // Optional property
}
import axios, { AxiosRequestConfig, AxiosHeaders } from 'axios'
```

- tested two approaches

- typed config with headers, empty object payload, access key in bearer header

```tsx
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
```

menuSlice.tsx

- update naming

store.ts

- insert reducers

```ts
import menuReducer from '@/lib/features/menu'
import tenantReducer from '@/lib/features/tenantSlice'
import apiReducer from '@/lib/features/apiKeySlice'

  reducer: {
    menuState: menuReducer,
    tenantState: tenantReducer,
    apiState: apiReducer,
  },
})
```

layout.tsx

```tsx
import {
 ...
  type LoaderFunction,
} from 'react-router-dom'

import { ReduxStore } from '@/lib/store'

import { setApiKey } from '@/lib/features/apiKeySlice'
import { setTenant } from '@/lib/features/tenantSlice'
export const loader =
  (store: ReduxStore): LoaderFunction =>
  async () => {
    try {
      console.log('layout loader')
      const apiKey = store.getState().apiState.apiKey
      if (!apiKey) {
        console.log('api key', apiKey)
        const { data } = await customFetch.post('/keys') //should crud manage, post is basically get
        //yum-7BTxHCyHhzIME5TI
        if (data?.key) {
          store.dispatch(setApiKey(data.key))
        }
      }
      //ONboarding
      //1. multi-tenant application, single-tenannt application, session-based tenant creation
      const tenant = store.getState().tenantState.id
      if (!tenant) {
        console.log('tenant', tenant)
        const params = { name: 'erik.jonsson@chassacademy.se' }
        const { data } = await customFetch.post('/tenants', params) //no need batch
        if (data?.key) {
          store.dispatch(setTenant({ name: data.name, id: data.id }))
        }
      }
      //200,401,404, need access key

      return null
    } catch (error) {
      console.log(error)
      return null
    }
  }
```

Menu.tsx

```tsx

```

customFetch.tsx

```tsx
 headers: {
    'Content-Type': 'application/json', //required
    Accept: 'application/json',
  },
})
import { store } from '@/lib/store'
// Adding interceptors to include headers in each request
customFetch.interceptors.request.use(
  (config) => {
    // Fetch the API key and tenant name from the Redux store

    const subdomain = '9oxx' //|| window.location.hostname.split('.')[0] //C:\Windows\System32\drivers\etc\hosts // local dev env.

    const apiKey = store.getState().apiState.apiKey || 'yum-7BTxHCyHhzI'
    const tenant = store.getState().tenantState.name || subdomain

    // Include headers if values exist
    if (apiKey) {
      config.headers['Authorization'] = `Bearer ${apiKey}`
    }
    if (tenant) {
      config.headers['X-Tenant-Name'] = tenant
    }
    config.headers['Content-Type'] = 'application/json'

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error with request:', error.config)
    console.error('Error details:', error)
    return Promise.reject(error)
  }
)

//customFetch.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

export default customFetch
//  'Content-Type': 'multipart/form-data',
```

####
