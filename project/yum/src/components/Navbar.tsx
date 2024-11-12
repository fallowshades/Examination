import { IoBagOutline } from 'react-icons/io5'
const Navbar = () => {
  return (
    <nav>
      <div className='cart-container'>
        <IoBagOutline className='cart-icon' />
        <span className='cart-badge'>0</span>
      </div>
    </nav>
  )
}

export default Navbar
