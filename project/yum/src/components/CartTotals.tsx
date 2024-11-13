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
