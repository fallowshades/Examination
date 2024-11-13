const Ingredients = ({ ingredientItem, endOfArray, type, addToCart }: any) => {
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
          onClick={addToCart}
        >
          {ingredientItem}
          {!endOfArray && ','}
        </button>
      )}
    </span>
  )
}

export default Ingredients
