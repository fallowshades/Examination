import { IoBagOutline } from 'react-icons/io5'
import { useAppSelector } from '@/lib/hooks'
const Navbar = () => {
  const numItemsInCart =
    useAppSelector((state) => state.menuState.numItemsInCart) || 0
  return (
    <nav>
      <div className='cart-container'>
        <IoBagOutline className='cart-icon' />
        <span className='cart-badge'>{numItemsInCart}</span>
      </div>
    </nav>
  )
}

export default Navbar
