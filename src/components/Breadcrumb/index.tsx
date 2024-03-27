import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import menuList, { deepFindMenu } from '../../config/menu'
import type { menuItemType } from '../../config/menu'
import { Icon } from '../SvgIcon'
import './index.less'

const useFindMenu = (menuList: menuItemType[]) => {
  const location = useLocation()
  const [currentMenu, setCurrentMenu] = useState<menuItemType | null>(null)

  useEffect(() => {
    const current = deepFindMenu(menuList, location.pathname)
    setCurrentMenu(current)
  }, [location])

  return [currentMenu]
}

const Breadcrumb: FC = (props) => {
  const navigator = useNavigate()
  const [currentMenu] = useFindMenu(menuList)

  const handleBack = () => {
    navigator(-1)
  }

  return (
    <div className='breadcrumb'>
      {
        currentMenu?.isleaf ? (
          <span className='breadcrumb-btn' onClick={handleBack}><Icon name="Return" /></span>
        ) : null
      }
      
      <div className='breadcrumb-text'>{ currentMenu?.label }</div>
    </div>
  )
}

export default Breadcrumb