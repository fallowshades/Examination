const Ingredients = ({ ingredientItem, endOfArray, type, addToCart }: any) => {
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Toggle style directly on the clicked element
    const target = event.currentTarget
    target.style.backgroundColor =
      target.style.backgroundColor === 'green' ? '' : 'green'
    target.style.border =
      target.style.border === '2px solid darkgreen' ? '' : '2px solid darkgreen'

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
