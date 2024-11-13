import Item from './Item'
import { AiTwotonePlusCircle, AiTwotoneMinusCircle } from 'react-icons/ai'
import { handleItemQuantityChange } from '@/lib/features/menu'
import { useAppDispatch } from '@/lib/hooks'
const CartItem = ({ cartItem }: any) => {
  const { cartID, title, price, amount } = cartItem
  const dispatch = useAppDispatch()

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
    <article className='cart-item'>
      <div>
        <Item item={cartItem}></Item>
        <h5>{title}</h5>
        <span className='item-price'>${price}</span>
        {/* remove button */}
      </div>

      <div className='amount-container'>
        {/* increase amount */}
        <button
          className='amount-btn'
          onClick={handleIncrement}
        >
          <AiTwotonePlusCircle className='amount-icon' />
        </button>
        {/* amount */}
        <span className='amount'>{amount}</span>
        {/* decrease amount */}
        <button
          className='amount-btn'
          onClick={handleDecrement}
        >
          <AiTwotoneMinusCircle className='amount-icon' />
        </button>
      </div>
    </article>
  )
}

export default CartItem
