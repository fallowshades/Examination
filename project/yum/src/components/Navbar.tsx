import { IoBagOutline } from 'react-icons/io5'
import { useAppSelector } from '@/lib/hooks'
import { Link } from 'react-router-dom'
const Navbar = () => {
  const numItemsInCart =
    useAppSelector((state) => state.menuState.numItemsInCart) || 0
  const tenentName = useAppSelector((state) => state.tenantState.id) || 0

  return (
    <nav>
      <Link
        to={`checkout/${tenentName}`}
        className='cart-container'
      >
        <IoBagOutline className='cart-icon' />
        <span className='cart-badge'>{numItemsInCart}</span>
      </Link>
    </nav>
  )
}

export default Navbar
