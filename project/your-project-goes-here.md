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
