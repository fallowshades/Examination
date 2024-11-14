import { useState } from 'react'
import Item from '@/components/Item'
import { OptimalGroupedMetsa } from '@/utils/types'
const DistinctCardLayout = ({
  item,
  type,
  lazyBackendQuickFix,
}: OptimalGroupedMetsa) => {
  const [clicked, setClicked] = useState<boolean>(false)

  const itemStyle =
    type === 'wonton'
      ? {
          backgroundColor: clicked ? 'black' : '',
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
}

export default DistinctCardLayout
