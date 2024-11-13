import Item from '@/components/Item'
import { GroupedMenuItems } from '@/utils/types'
import { useState } from 'react'

const SharedCardLayout = ({ items, type }: GroupedMenuItems) => {
  const [clicked, setClicked] = useState(false)

  return (
    <div>
      {items.map((item) => {
        const lazyBackendQuickFix = items.map((item) => item.name)
        //define outside
        const itemStyle =
          type === 'wonton'
            ? {
                backgroundColor: clicked ? 'green' : '',
                border: clicked ? '2px solid darkgreen' : '',
              }
            : {}

        return (
          <div
            key={item.id}
            style={itemStyle}
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
