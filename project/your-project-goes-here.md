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

### temp do styles instead

item.tsx

- buttons or span

```tsx
import { MenuItem } from '@/utils/types'

const Item = ({ item }: { item: MenuItem }) => {
  return (
    <div>
      <div>
        <header className='item-info'>
          <h3> {item.name}</h3>

          <p></p>
          <h3>{item.price}SEK</h3>
        </header>
      </div>
      <div className='ingredients-container'>
        {item?.ingredients?.map((ingredientItem, index) => {
          return (
            <span key={index}>
              {item.type == 'wonton' ? (
                // For non-wonton items, display ingredient as text
                <span>
                  {ingredientItem}
                  {item.ingredients.length - 1 !== index && ','}
                </span>
              ) : (
                // For wonton items, display ingredient as a button
                <button>
                  {ingredientItem}
                  {item.ingredients.length !== index && ','}
                </button>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
```

index.css

[font] https://fonts.google.com/specimen/Fira+Sans

```css
/*
===============
Fonts
===============
@import url('https://fonts.googleapis.com/css?family=Open+Sans|Roboto:400,700&display=swap');

*/
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700&display=swap');


:root {
...
  --ff-primary: 'Fira Sans', sans-serif;
  --ff-secondary: 'Fira Sans', sans-serif;
  ...
  --snow: #f4f3f1;
  --ash: #eeeeee;
  --clay: #605858;
  --coal: #353131;
  --dark-mint: #489078;
  --shade-24-dark: rgba(#353131, 0.24);
  --shade-24-light: rgba(#f1f0ec, 0.24);
  --shade-12-light: rgba(#f1f0ec, 0.12);
  --red: #eb5757;
}

body {

  background: var(--dark-mint);
  color: var(--ash);

}

p {

  color: var(--ash);
}
```

```css
menu {
  padding: 5rem 0;
  background-color: var(--clay);
}
.menu-space {
  padding-top: 2em;
}

.menu:hover {
  background-color: var(--clr-black);
}
```

```css
.item-info p {
  flex-grow: 1; /* Make the <p> tag take up remaining space */
  text-align: center; /* Optionally center the "..." inside the <p> */
  margin: 0; /* Remove default margin */
  font-size: 1.5rem; /* Optional: Adjust size of "..." if needed */
  border-bottom: 0.5px dotted var(--ash);
  color: var(--ash);
}

.item-info h2 {
  margin: 0; /* Remove margin for name and price */
}

/*array if ingredients*/
.ingredients-container {
  padding-left: 1em;
  display: flex; /* Align ingredients horizontally */
  flex-wrap: wrap; /* Allow ingredients to wrap if needed */
  gap: 0.5rem; /* Optional: Add space between ingredients */
}
```

Checkout.tsx
Layout.tsx

- static return

Menu.tsx

```tsx
import { MenuItem } from '@/utils/types'
import Item from '@/components/Item'

const Menu = () => {
  const data = useLoaderData() as MenuItem[]

  // Combine all items into one array
  const allItems = ['wonton', 'dip', 'drink'].map((type) => ({
    type,
    items: data.filter((item) => item.type === type),
  }))
  return (
    <section className=''>
      <div className='grid-template'>
        {/* Render all items in a single loop */}
        {allItems.map(({ type, items }) => (
          <div
            key={type}
            className='menu-space'
          >
            {/* <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3> */}
            {items.map((item) => (
              <div
                key={item.id}
                className='menu'
              >
                <Item item={item} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
```

customFetch.tsx

- comment out https bc we are on v8 browser ontop of node. we cant acess fs for https, axios manage when see https in url

types.ts

- update name

```ts
export type MenuItem = {
```

#### correct menu mapping

Menu.tsx

- replacement to be inserted instead

```tsx
{
  items.map((item) => {
    const lazyBackendQuickFix = items.map((item) => item.name)
    return (
      <div
        key={item.id}
        className='menu'
      >
        {type == 'wonton' ? (
          <Item item={item} />
        ) : (
          <Item
            item={item}
            options={lazyBackendQuickFix}
          />
        )}
      </div>
    )
  })
}
```

item.tsx

-not there is a single difference that is toggleble

```tsx
import Ingredients from './Ingredients'

const Item = ({ item, options }: { item: MenuItem; options?: string[] }) => {
  console.log('item', item)
  return (
      <h3> {options ? item.type : item.name}</h3>

        <div className='ingredients-container'>
 {options
          ? options
          : item?.ingredients?.map((ingredientItem, index) => {
              return (
                <Ingredients
                  key={index}
                  type={item.type}
                  ingredientItem={ingredientItem}
                  endOfArray={item.ingredients.length - 1 == index}
                />
              )
            })}
        </div>)}
```

Ingredients.tsx

- boolean end of line

```tsx
const Ingredients = ({ ingredientItem, endOfArray, type }: any) => {
  return (
    <span>
      {type == 'wonton' ? (
        // For non-wonton items, display ingredient as text
        <span>
          {ingredientItem}
          {!endOfArray && ','}
        </span>
      ) : (
        // For wonton items, display ingredient as a button
        <button>
          {ingredientItem}
          {!endOfArray && ','}
        </button>
      )}
    </span>
  )
}

export default Ingredients
```

#### hover and nav effect

Navbar.tsx

```tsx
return (
  <nav>
    <div className='cart-container'>
      <IoBagOutline className='cart-icon' />
      <span className='cart-badge'>0</span>
    </div>
  </nav>
)
```

index.css

- relative top right

```css
.menu-space {
  padding-bottom: 2em;
}

.cart-icon {
  font-size: 24px; /* Adjust size as needed */
  color: var(--clay);
  background-color: var(var(--ash));
}

.cart-badge {
  position: absolute;
  top: -8px; /* Adjust positioning as needed */
  right: -8px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  width: 18px;
}

.cart-container {
  position: relative;
  display: inline-block;
  padding: 7px;
  background-color: white;
  border-radius: var(--radius);
}

nav {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}
```

Menu.tsx

- did not want margin, skip the centering

```tsx
     <h2 className='item-info'>Menu</h2>
      <div className=''>
```

#### map extra copies w conditional add rule (body,button)

Ingredients.tsx

```tsx
 <button className='btn'>
```

Item.tsx

- can map toggable

```tsx
{
  ;(options || item?.ingredients)?.map((ingredientItem, index) => {
    console.log(index)
    return (
      <Ingredients
        key={index}
        type={item.type}
        ingredientItem={ingredientItem}
        endOfArray={item?.ingredients?.length - 1 == index}
      />
    )
  })
}
```

index.css

```css
.btn {
  background: var(--clr-grey-8);
}

.menuEffect:hover {
  background-color: var(--clr-black);
}
```

Menu.tsx

```tsx
    <div
                  key={item.id}
                  className='menu'
                  className={`menu ${type == 'wonton' && 'menuEffect'}`}
```

#### add to cart

Ingredients.tsx

```tsx
const Ingredients = ({ ingredientItem, endOfArray, type, addToCart }: any) => {

  {type == 'wonton' ? (
      ) : (

        <button
          className='btn'
          onClick={addToCart}
        >)
  }
}
```

Item.tsx

```tsx
import { useAppDispatch } from '@/lib/hooks'
import { CartItem } from '@/utils/types'
import { addItem } from '@/lib/features/menu'
const Item = ({
  item,
  options,
  clicked,
  setClicked,
}: {
  item: MenuItem
  options?: string[]
  clicked: any
  setClicked: any
}) => {
  console.log('item', item)

  const dispatch = useAppDispatch()
  const menuProduct: CartItem = {
    cartID: String(item.id),
    productID: item.id,
    title: item.name,
    price: String(item.price),
    amount: 1,
  }

  const addToCart = () => {
    console.log('clicked')
    dispatch(addItem(menuProduct))
    setClicked(!clicked)
  }

  return(
   <div onClick={() => !options && addToCart()}>
      {' '}
        <h3> {options == null ? item.type : item.name}</h3>
...
 {(options || item?.ingredients)?.map((ingredientItem, index) => {
          console.log(index)
          return (
            <Ingredients
              key={index}
              type={item.type}
              ingredientItem={ingredientItem}
              endOfArray={item?.ingredients?.length - 1 == index}
              addToCart={addToCart}
            />
          )
        })}
  )
```

index.css

```css
p {
  border: 1px solid var(--clr-grey-8);
}
```

hooks.ts

```ts
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

#### highlight

types.ts

```ts
export type GroupedMenuItems = {
  type: string
  items: MenuItem[]
}
```

Menu.tsx

-

```tsx
import SharedCardLayout from '@/components/SharedCardLayout'

return (
  <section className=''>
    <SharedCardLayout
      items={items}
      type={type}
    />
  </section>
)
```

SharedCardLayout.tsx

```tsx
import Item from '@/components/Item'
import { GroupedMenuItems } from '@/utils/types'
import { useState } from 'react'

const SharedCardLayout = ({ items, type }: GroupedMenuItems) => {
  const [clicked, setClicked] = useState(false)
  return (
    <div>
      {items.map((item) => {
        const lazyBackendQuickFix = items.map((item) => item.name)
        return (
          <div
            key={item.id}
            style={{
              backgroundColor: clicked ? 'green' : '', // Example: change color when clicked
              border: clicked ? '2px solid darkgreen' : '', // Border change to indicate activation
            }}
            className={`menu ${type == 'wonton' && 'menuEffect'}`}
          >
            {type == 'wonton' ? (
              <Item
                item={item}
                clicked={clicked}
                setClicked={setClicked}
              />
            ) : (
              <Item
                item={item}
                options={lazyBackendQuickFix}
                clicked={clicked}
                setClicked={setClicked}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SharedCardLayout
```

#### style obj postfix for interaction in layout and buttons

Ingredients.tsx

- can useState or set style post click

```tsx
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Toggle style directly on the clicked element
    const target = event.currentTarget
    target.style.backgroundColor =
      target.style.backgroundColor === 'green' ? '' : 'green'
    target.style.border =
      target.style.border === '2px solid darkgreen' ? '' : '2px solid darkgreen'

    addToCart() // Call your function when clicked
  }

   onClick={(e) => {
            handleButtonClick(e)
          }}
```

SharedCardLayout.tsx

- not style should be around the whole item (can move all type conditions in AharedCardLayout)

```tsx
  //define outside
        const itemStyle =
          type === 'wonton'
            ? {
                backgroundColor: clicked ? 'green' : '',
                border: clicked ? '2px solid darkgreen' : '',
              }
            : {}
 return (
          <div
            key={item.id}

            style={itemStyle}
           >...
```

#### distinct hook seperation of consern map key index

DistinctCardLayout.tsx

```tsx
import { useState } from 'react'
import Item from '@/components/Item'

const DistinctCardLayout = ({ item, type, lazyBackendQuickFix }: any) => {
  const [clicked, setClicked] = useState(false)

  const itemStyle =
    type === 'wonton'
      ? {
          backgroundColor: clicked ? 'green' : '',
          border: clicked ? '2px solid darkgreen' : '',
        }
      : {}

  return (
    <div
      key={item.id}
      style={itemStyle}
      className={`menu ${type == 'wonton' && 'menuEffect'}`}
    >
      {type == 'wonton' ? (
        <Item
          item={item}
          clicked={clicked}
          setClicked={setClicked}
        />
      ) : (
        <Item
          item={item}
          options={lazyBackendQuickFix}
          clicked={clicked}
          setClicked={setClicked}
        />
      )}
    </div>
  )
}

export default DistinctCardLayout
```

Item.tsx

- uh d ont need check null, mb undefined?

```tsx
<h3> {options ? item.type : item.name}</h3>
```

Navbar.tsx

```tsx
import { useAppSelector } from '@/lib/hooks'
const Navbar = () => {
  const numItemsInCart =
    useAppSelector((state) => state.menuState.numItemsInCart) || 0
  return (
    <nav>
        <span className='cart-badge'>{numItemsInCart}</span>
    ...)
}
```

SharedCardLayout.tsx

```tsx
import { useState } from 'react'
import DistinctCardLayout from './DistinctCardLayout'
return (
  <DistinctCardLayout
    key={item.id}
    item={item}
    type={type}
    lazyBackendQuickFix={lazyBackendQuickFix}
  />
)
```

features/menu.tsx

- note need policy add to cart.

```tsx
const defaultState: CartState = {
  cartItems: [],

  numItemsInCart: 0,
  cartTotal: 0,
}
```

routes/Menu.tsx

- multiple item in group with same type

```tsx
      {
          id: 2,
          type: 'wonton',
          name: 'lala',
          description:
            'En god friterad wonton med smaker från de värmländska skogarna.',
          price: 129,
          ingredients: ['kål', 'morot', 'salladslök'],
        },
        {
          id: 3,
          type: 'wonton',
          name: 'kitrbonana',
          description:
            'En god friterad wonton med smaker från de värmländska skogarna.',
          price: 129,
          ingredients: ['kål', 'morot', 'salladslök'],
        },
```

types.ts

```ts
xport type CartState = {
...
  numItemsInCart: number
  cartTotal: number
}
```

#### cart setup

App.tsx

```tsx
 path: 'checkout/:id',
```

CartItem.tsx

```tsx
import { FaChevron, FaChevronDown } from 'react-icons/fa'
import { addItem, removeItem } from '@/lib/features/menu'
const CartItem = ({ cartItem }: any) => {
  const { cartID, title, price, amount } = cartItem
  return (
    <article className='cart-item'>
      <div>
        <h5>{title}</h5>
        <span className='item-price'>${price}</span>
        {/* remove button */}
      </div>
      <div>
        {/* increase amount */}
        <button
          className='amount-btn'
          onClick={() => addItem(cartID)}
        >
          <FaChevronUp className='amount-icon' />
        </button>
        {/* amount */}
        <span className='amount'>{amount}</span>
        {/* decrease amount */}
        <button
          className='amount-btn'
          onClick={() => removeItem(cartID)}
        >
          <FaChevronDown className='amount-icon' />
        </button>
      </div>
    </article>
  )
}

export default CartItem
```

CartItemsList.tsx

```tsx
import { useAppSelector } from '@/lib/hooks'
import CartItem from './CartItem'
const CartItemsList = () => {
  const cartItems = useAppSelector((state) => state.menuState.cartItems)
  if (cartItems.length === 0) {
    return (
      <section className='cart'>
        {/* cart header */}
        <header>
          <h2>your bag</h2>
          <h4 className='empty-cart'>is currently empty</h4>
        </header>
      </section>
    )
  }
  return (
    <section className='cart'>
      {/* cart header */}
      <header>
        <h2>your bag</h2>
      </header>
      {/* cart items */}
      <div>
        {cartItems.map((item) => {
          return (
            <CartItem
              key={item.cartID}
              cartItem={item}
            />
          )
        })}
      </div>
    </section>
  )
}

export default CartItemsList
```

CartTotals.tsx

```tsx
import { useAppSelector } from '@/lib/hooks'
const CartTotals = () => {
  const totalCost = useAppSelector((state) => state.menuState.cartTotal)

  return (
    <footer>
      <hr />
      <div>
        <h5 className='cart-total'>
          total <span>${totalCost.toFixed(2)}</span>
        </h5>
      </div>
    </footer>
  )
}

export default CartTotals
```

Navbar.tsx

```tsx
  const tenentName = useAppSelector((state) => state.tenantState.id) || 0


<Link
        to={`checkout/${tenentName}`}
        className='cart-container'
      >
    ...
      </Link>
```

index.css

```css
/*
=============== 
Cart
===============
*/
.cart {
  min-height: calc(100vh - 4rem);
  width: var(--view-width);
  margin: 0 auto;
  margin-top: 40px;
  padding: 2.5rem 0;
  max-width: var(--fixed-width);
}
.cart h2 {
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 3rem;
}
.empty-cart {
  text-transform: lowercase;
  color: var(--grey-500);
  margin-top: 1rem;
  text-align: center;
}
hr {
  background: var(--grey-300);
  border-color: transparent;
  border-width: 1px;
  margin-bottom: 1rem;
}
.cart footer {
  margin-top: 5rem;
  text-align: center;
}
.cart-total {
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.cart-total span {
  background: var(--primary-500);
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: var(--borderRadius);
  color: var(--white);
}

/*
=============== 
Cart Item
===============
*/
.cart-item {
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 1.5rem;
  margin: 1.5rem 0;
}
.cart-item img {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
}
.cart-item h5 {
  margin-bottom: 0.5rem;
  font-weight: 500;
  letter-spacing: 2px;
  color: var(--grey-700);
}
.item-price {
  color: var(--grey-500);
  display: block;
}
.remove-btn {
  color: var(--primary-500);
  letter-spacing: var(--letterSpacing);
  cursor: pointer;
  font-size: 0.85rem;
  background: transparent;
  border: none;
  margin-top: 0.375rem;
  transition: var(--transition);
}
.remove-btn:hover {
  color: var(--primary-600);
}
.amount-btn {
  width: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
}
.amount-icon {
  font-size: 1.25rem;
  color: var(--primary-500);
  transition: var(--transition);
}
.amount-icon:hover {
  color: var(--primary-700);
}
.amount {
  text-align: center;
  margin-bottom: 0;
  font-size: 1.25rem;
  line-height: 1;
  display: block;
}
```

Checkout.tsx

```tsx
import CartItemsList from '@/components/CartItemsList'
import CartTotals from '@/components/CartTotals'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/lib/hooks'
const Checkout = () => {
  const tenentName = useAppSelector((state) => state.tenantState.id) || 0

  return (
    <>
      <div className='mt-8 grid gap-8  lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList />
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <CartTotals />
          {tenentName ? (
            <Link
              to='/dashboard/checkout'
              className='btn btn-primary btn-block mt-8'
            >
              Proceed to checkout
            </Link>
          ) : (
            <Link
              to='/login-interior'
              className='btn btn-primary btn-block mt-8'
            >
              on boarding
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
```

#### incrememt decrement reducer

CartItem.tsx

```tsx
import Item from './Item'
import { AiTwotonePlusCircle, AiTwotoneMinusCircle } from 'react-icons/ai'
import { handleItemQuantityChange } from '@/lib/features/menu'
import { useAppDispatch } from '@/lib/hooks'
const CartItem = ({ cartItem }: any) => {

onst dispatch = useAppDispatch()

  const handleIncrement = () => {
    console.log('increment')
    dispatch(
      handleItemQuantityChange({ cartID: cartID, changeType: 'increment' })
    ) // Ensure dispatch is called correctly
  }

  const handleDecrement = () => {
    console.log('decrement')
    dispatch(
      handleItemQuantityChange({ cartID: cartID, changeType: 'decrement' })
    ) // Ensure dispatch is called correctly
  }

  return (
     <div>
        <Item item={cartItem}></Item>


      </div>
    <div className='amount-container'>
  )

}
```

CartItemsList.tsx

- multiple cart items with the same cartID appearently

```tsx
 {cartItems.map((item, index) => {
          return (
            <CartItem

              key={item.cartID + index}
```

Item.tsx

- share item with cart that do not have a layout click

```tsx
}: {

  clicked?: any
  setClicked?: any
}) => {

    const addToCart = () => {
   ...
    if (setClicked) {
      dispatch(addItem(menuProduct))
      setClicked(!clicked)
    }
  }

   <h3> {options ? item.type : item.name || item.title}</h3>
```

index.css

```css
.amount-container {
  display: flex;
}
.amount-btn {
  display: flex;
}
```

menu.tsx

- annother reducer

```tsx
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
```

types.ts

```ts
 export type MenuItem = {
  ...
}
} & { title: string }
```

#### css and action differences between pages

index.html

```html
<body class="primary-theme"></body>
```

App.tsx

```tsx
import { action as CheckoutAction } from '@/routes/CheckoutAction'

      path: 'checkout-action',
        action: CheckoutAction(store),
        element: <div>h</div>,
      },
```

CartTotal.tsx

```tsx
<button>
  {' '}
  <span>${totalCost.toFixed(2)}</span> total
</button>
```

Item.tsx

```tsx
import { useState } from 'react'

  const checkDefaultTheme = () => {
    const isDefaultPath = location.pathname !== '/'

    return isDefaultPath
  }

  const [NotPrimaryTheme, setTheme] = useState(checkDefaultTheme())

  <header className={`item-info ${checkDefaultTheme() && 'black'}`}>
```

index.css

- body theme exist a [] but we prefere tailwind

```css
body {
  background: var(--ash);
  color: var(--clr-black);
}

.primary-theme {
  font-family: var(--ff-secondary);
  background: var(--dark-mint);
  color: var(--ash);
}

.secondary-theme {
  font-family: var(--ff-secondary);
  background: var(--clay);
  color: var(--white);
}
```

- basically tailwind (dots has other default color)

```css
.item-info.black p {
  border-bottom-color: var(--clr-black);
}

button.black {
  background-color: #222;
  color: white;
}
```

- special button

```css
.white {
  background-color: var(--ash);
}

.cart-total button {
  text-transform: capitalize;
  padding: 0.5rem 1rem; /* Add padding for better button appearance */
  display: flex;
  align-items: center; /* Center text inside the button */
  justify-content: center; /* Center text inside the button */
  margin: 0 auto; /* Center the button horizontally */
}
```

apiKeySlice.tsx

```tsx
const getApiKeyFromLocalStorage = (): ApiKeyState => {
...
  const apiKey = localStorage.getItem('api-key')
...
}
```

Checkout.tsx

- set up action in another page

```tsx
import { Link, Form } from 'react-router-dom'
;<Form
  method='post'
  action={`../checkout-action`}
>
  <button
    type='submit'
    className='btn delete-btn black'
  >
    Take my money
  </button>
</Form>
```

CheckoutAcction.tsx

- send orders

```tsx
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
```

Layout.tsx

- on every window.location use reusable function

```tsx
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
const Layout = () => {

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


...
}
```
