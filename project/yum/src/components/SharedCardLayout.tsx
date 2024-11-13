import { GroupedMenuItems } from '@/utils/types'
import DistinctCardLayout from './DistinctCardLayout'

const SharedCardLayout = ({ items, type }: GroupedMenuItems) => {
  return (
    <div>
      {items.map((item, index) => {
        const lazyBackendQuickFix = items.map((item) => item.name)
        //define outside

        if (type != 'wonton' && index == 0) {
          return (
            <DistinctCardLayout
              key={item.id}
              item={item}
              type={type}
              lazyBackendQuickFix={lazyBackendQuickFix}
            />
          )
        } else {
          if (type == 'wonton') {
            return (
              <DistinctCardLayout
                key={item.id}
                item={item}
                type={type}
                lazyBackendQuickFix={lazyBackendQuickFix}
              />
            )
            return <></>
          }
        }
      })}
    </div>
  )
}

export default SharedCardLayout
