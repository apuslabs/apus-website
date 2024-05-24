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
    label: 'Account',
    key: 'account',
    path: '/app/account',
    icon: <Icon name='Dashboard' />,
    isleaf: 0
  },
  {
    label: 'Workers',
    key: 'works',
    path: '/app/workers',
    icon: <Icon name='Node' />,
    isleaf: 0,
    rouchildren: [
      {
        label: 'Run new GPU',
        key: 'worksNew',
        path: '/app/workers/new',
        isleaf: 1
      }
    ]
  },
  {
    label: 'Ai Agents',
    key: 'aiAgents',
    path: '/app/aiAgents',
    icon: <Icon name='Brain' />,
  },
]

export default menuList


interface menuType {
  name: string
  path: string
}

export const DocLink = 'https://apus-network.gitbook.io/apus-console-docs/'

export const HeaderMenuList: menuType[] = [
  { 
    name: 'Doc',
    path: DocLink
  },
  { 
    name: 'Ecosystem',
    path: '/home/ecosystem'
  },
  {
    name: 'Playground',
    path: 'https://solplayground.apus.network/'
  },
  { 
    name: 'Task',
    path: '/home/task'
  },
  {
    name: 'Galxe Events',
    path: 'https://app.galxe.com/quest/8FWGXFwnzm3xkWkRiKzopd/GCUaQtzyws'
  }
]

export const FooterMenuList: menuType[] = [
  { 
    name: 'Ecosystem',
    path: '/home/ecosystem'
  },
  {
    name: 'Playground',
    path: 'https://solplayground.apus.network/'
  },
  { 
    name: 'Task',
    path: '/home/task'
  },
  {
    name: 'Galxe Events',
    path: 'https://app.galxe.com/quest/8FWGXFwnzm3xkWkRiKzopd/GCwrpthpgb'
  },
  // {
  //   name: 'Brand Kits',
  //   path: ""
  // }
]

export const FooterSocialMediaList: menuType[] = [
  {
    name: 'Twitter',
    path: 'https://twitter.com/intent/follow?screen_name=apus_network'
  },
  {
    name: 'Telegram',
    path: 'https://t.me/apusnetwork'
  },
  {
    name: 'Discord',
    path: 'https://discord.gg/NVqpWB2m8k'
  },
  {
    name: "Docs",
    path: "https://apus-network.gitbook.io/apus-console-docs/"
  }
]