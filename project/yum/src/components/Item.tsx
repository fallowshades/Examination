import { MenuItem } from '@/utils/types'

const Item = ({ item }: { item: MenuItem }) => {
  return (
    <div>
      <div>
        <header className='item-info'>
          <h3> {item.name}</h3>

          <p></p>
          <h3>{item.price}SEK</h3>
        </header>
      </div>
      <div className='ingredients-container'>
        {item?.ingredients?.map((ingredientItem, index) => {
          return (
            <span key={index}>
              {item.type == 'wonton' ? (
                // For non-wonton items, display ingredient as text
                <span>
                  {ingredientItem}
                  {item.ingredients.length - 1 !== index && ','}
                </span>
              ) : (
                // For wonton items, display ingredient as a button
                <button>
                  {ingredientItem}
                  {item.ingredients.length !== index && ','}
                </button>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default Item
