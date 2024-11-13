import { MenuItem } from '@/utils/types'
import Ingredients from './Ingredients'
import { useAppDispatch } from '@/lib/hooks'
import { CartItem } from '@/utils/types'
import { addItem } from '@/lib/features/menu'
import { useState } from 'react'
const Item = ({
  item,
  options,
  clicked,
  setClicked,
}: {
  item: MenuItem
  options?: string[]
  clicked?: any
  setClicked?: any
}) => {
  const dispatch = useAppDispatch()
  const menuProduct: CartItem = {
    cartID: String(item.id + item.type),
    productID: item.id,
    title: item.name,
    price: String(item.price),
    amount: 1,
  }

  const addToCart = () => {
    console.log('clicked')
    if (setClicked) {
      dispatch(addItem(menuProduct))
      setClicked(!clicked)
    }
  }

  const checkDefaultTheme = () => {
    const isDefaultPath = location.pathname !== '/'

    return isDefaultPath
  }

  const [NotPrimaryTheme, setTheme] = useState(checkDefaultTheme())

  return (
    <div onClick={() => !options && addToCart()}>
      {' '}
      <div>
        <header className={`item-info ${checkDefaultTheme() && 'black'}`}>
          <h3> {options ? item.type : item.name || item.title}</h3>

          <p></p>
          <h3>{item.price}SEK</h3>
        </header>
      </div>
      <div className='ingredients-container'>
        {(options || item?.ingredients)?.map((ingredientItem, index) => {
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
      </div>
    </div>
  )
}

export default Item
