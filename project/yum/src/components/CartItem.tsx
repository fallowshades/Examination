import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
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
