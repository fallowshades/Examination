type IngredientsProps = {
  ingredientItem: string
  endOfArray: boolean
  type: string
  addToCart: () => void
}

const Ingredients = ({
  ingredientItem,
  endOfArray,
  type,
  addToCart,
}: IngredientsProps) => {
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Toggle style directly on the clicked element
    const target = event.currentTarget
    target.style.backgroundColor =
      target.style.backgroundColor === 'black' ? '' : 'black'
    target.style.border =
      target.style.border === '2px solid darkgreen' ? '' : '2px solid darkgreen'
    target.style.color = target.style.color === 'black' ? '' : 'white'
    addToCart() // Call your function when clicked
  }

  return (
    <span>
      {type == 'wonton' ? (
        // For non-wonton items, display ingredient as text
        <span>
          {ingredientItem}
          {!endOfArray && ','}
        </span>
      ) : (
        // For wonton items, display ingredient as a button
        <button
          className='btn'
          onClick={(e) => {
            handleButtonClick(e)
          }}
        >
          {ingredientItem}
          {!endOfArray && ','}
        </button>
      )}
    </span>
  )
}

export default Ingredients
