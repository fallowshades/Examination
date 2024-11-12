const Ingredients = ({ ingredientItem, endOfArray, type }: any) => {
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
        <button>
          {ingredientItem}
          {!endOfArray && ','}
        </button>
      )}
    </span>
  )
}

export default Ingredients