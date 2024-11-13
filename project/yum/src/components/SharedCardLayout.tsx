import Item from '@/components/Item'
import { GroupedMenuItems } from '@/utils/types'
import { useState } from 'react'

const SharedCardLayout = ({ items, type }: GroupedMenuItems) => {
  const [clicked, setClicked] = useState(false)
  return (
    <div>
      {items.map((item) => {
        const lazyBackendQuickFix = items.map((item) => item.name)
        return (
          <div
            key={item.id}
            style={{
              backgroundColor: clicked ? 'green' : '', // Example: change color when clicked
              border: clicked ? '2px solid darkgreen' : '', // Border change to indicate activation
            }}
            className={`menu ${type == 'wonton' && 'menuEffect'}`}
          >
            {type == 'wonton' ? (
              <Item
                item={item}
                clicked={clicked}
                setClicked={setClicked}
              />
            ) : (
              <Item
                item={item}
                options={lazyBackendQuickFix}
                clicked={clicked}
                setClicked={setClicked}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SharedCardLayout
