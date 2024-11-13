import { useAppSelector } from '@/lib/hooks'
const CartTotals = () => {
  const totalCost = useAppSelector((state) => state.menuState.cartTotal)

  return (
    <footer>
      <hr />
      <div>
        <h5 className='cart-total'>
          <button>
            {' '}
            <span>${totalCost.toFixed(2)}</span> total
          </button>
        </h5>
      </div>
    </footer>
  )
}

export default CartTotals
