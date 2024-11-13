import { MenuItem } from '@/utils/types'
import Ingredients from './Ingredients'
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

  return (
    <div onClick={() => !options && addToCart()}>
      {' '}
      <div>
        <header className='item-info'>
          <h3> {options == null ? item.type : item.name}</h3>

          <p></p>
          <h3>{item.price}SEK</h3>
        </header>
      </div>
      <div className='ingredients-container'>
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
      </div>
    </div>
  )
}

export default Item
