import { MenuItem } from '@/utils/types'
import Ingredients from './Ingredients'

const Item = ({ item, options }: { item: MenuItem; options?: string[] }) => {
  console.log('item', item)
  return (
    <div>
      <div>
        <header className='item-info'>
          <h3> {options ? item.type : item.name}</h3>

          <p></p>
          <h3>{item.price}SEK</h3>
        </header>
      </div>
      <div className='ingredients-container'>
        {options
          ? options
          : item?.ingredients?.map((ingredientItem, index) => {
              return (
                <Ingredients
                  key={index}
                  type={item.type}
                  ingredientItem={ingredientItem}
                  endOfArray={item.ingredients.length - 1 == index}
                />
              )
            })}
      </div>
    </div>
  )
}

export default Item
