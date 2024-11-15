//import customFetch from '@/utils/customFetch'
import { type ReduxStore } from '@/lib/store'
import { useLoaderData, type LoaderFunction } from 'react-router-dom'

export const loader =
  (store: ReduxStore): LoaderFunction =>
  async ({ request }: { request: Request }) => {
    return null
  }

import { Link, Form } from 'react-router-dom'
import { useAppSelector } from '@/lib/hooks'
const Receipts = () => {
  const tenentName = useAppSelector((state) => state.tenantState.id) || 0

  return (
    <>
      <div className='mt-8 grid gap-8  lg:grid-cols-12 '>
        <div className=''>
          <div className='image-container'>
            <img
              src='/assets/boxtop.png'
              alt=''
              className='img'
            />
          </div>
          <h1>Dina wontons tillagas</h1>
          <br />
          <br />
          <br />
          <br />
          <p>Eta 5 min</p>
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <button className='btn'>Se Kvitto</button>
          {tenentName ? (
            <Link
              to='/dashboard/checkout'
              className='btn btn-primary btn-block mt-8'
            >
              Proceed to checkout
            </Link>
          ) : (
            <Link
              to='/'
              className='btn delete-btn black'
            >
              gör en ny beställning
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default Receipts
