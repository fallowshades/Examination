import { GroupedMenuItems } from '@/utils/types'
import DistinctCardLayout from './DistinctCardLayout'

const SharedCardLayout = ({ items, type }: GroupedMenuItems) => {
  return (
    <div>
      {items.map((item) => {
        const lazyBackendQuickFix = items.map((item) => item.name)
        //define outside

        return (
          <DistinctCardLayout
            key={item.id}
            item={item}
            type={type}
            lazyBackendQuickFix={lazyBackendQuickFix}
          />
        )
      })}
    </div>
  )
}

export default SharedCardLayout
