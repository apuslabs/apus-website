import { Icon } from '../components/SvgIcon'
import { ReactElement } from 'react'

export interface menuItemType {
  label: string,
  key?: string,
  path: string,
  icon?: ReactElement,
  rouchildren?: menuItemType[]
  isleaf?: number
}

export const deepFindMenu = (menuList: menuItemType[], pathname: string): menuItemType | null => {
  for (const item of menuList) {
    if (item.path.includes(pathname)) {
      return item;
    }

    if (item.rouchildren && item.rouchildren.length > 0) {
      const foundInChildren = deepFindMenu(item.rouchildren, pathname);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }

  return null; // 如果没有找到匹配项，则返回null
}

const menuList = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    path: '/dashboard',
    icon: <Icon name='Dashboard' />,
    isleaf: 0
  },
  {
    label: 'Works',
    key: 'works',
    path: '/works',
    icon: <Icon name='Node' />,
    isleaf: 0,
    rouchildren: [
      {
        label: 'Run new GPU',
        key: 'worksNew',
        path: '/works/new',
        isleaf: 1
      }
    ]
  },
  // {
  //   label: 'Ai Agents',
  //   key: 'aiAgents',
  //   icon: <Icon name='Brain' />,
  // },
]

export default menuList