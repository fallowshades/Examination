import './App.css'
import Menu, { loader as MenuLoader } from './routes/Menu'
import Checkout, { loader as CheckoutLoader } from './routes/Checkout'
import Receipts, { loader as ReceiptsLoader } from './routes/Receipts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout, { loader as layoutLoader } from './routes/Layout'
import { store } from './lib/store'
import NoMatch from './routes/NoMatch'
import { action as CheckoutAction } from '@/routes/CheckoutAction'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    loader: layoutLoader(store),

    children: [
      {
        index: true,
        element: <Menu />,
        loader: MenuLoader(store),
      },
      {
        path: 'checkout/:id',
        element: <Checkout />,
        loader: CheckoutLoader(store),
        action: CheckoutAction(store),
      },
      {
        path: 'receipts',
        element: <Receipts />,
        loader: ReceiptsLoader(store),
      },
      {
        path: 'checkout-action',
        action: CheckoutAction(store),
        element: <div>h</div>,
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
