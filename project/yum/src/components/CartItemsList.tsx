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
        {cartItems.map((item, index) => {
          return (
            <CartItem
              key={item.cartID + index}
              cartItem={item}
            />
          )
        })}
      </div>
    </section>
  )
}

export default CartItemsList
