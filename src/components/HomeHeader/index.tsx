import { FC, useEffect, useRef, useState } from 'react'
import { ApusLogo } from "../../assets/image";
import { useNavigate, useLocation } from 'react-router-dom';
import './index.less'
import { Button } from 'antd';
import { Icon } from '../../components/SvgIcon'

interface menuType {
  name: string
  path: string
}

const HomeHeader: FC = (props) => {
  const [currentMenu, setCurrentMenu] = useState<string>('')
  const [menuShow, setMenuShow] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(true)

  const menuRef = useRef(null)

  const location = useLocation()

  useEffect(() => {
    const current = menu.find(item => item.path?.includes(location.pathname))
    if (current) {
      setCurrentMenu(current.name)
    }
  }, [location])

  // 根据尺寸判断是否显示菜单
  useEffect(() => {
    if (window.innerWidth >= 767) {
      setIsMobile(false)
      setMenuShow(true)
    }
  }, [])

  // useEffect(() => {
  //   const handleClickOutside = (event: Event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setMenuShow(false)
  //     }
  //   }
  //   // 添加全局点击事件监听器
  //   document.addEventListener('mousedown', handleClickOutside);

  //   // 清理函数：在组件卸载时移除事件监听器
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [menuRef])

  const menu: menuType[] = [
    { 
      name: 'Doc',
      path: '/home/doc'
    },
    { 
      name: 'Ecosystem',
      path: '/home/ecosystem'
    },
    {
      name: 'Playground',
      path: ''
    },
    { 
      name: 'Task',
      path: '/home/task'
    },
  ]

  const navigate = useNavigate()

  const handleMenuNavigate = (data: menuType) => {
    if (data.name === 'Doc') {
      window.open('https://www.baidu.com')
    } else {
      navigate(data.path)
    }
  }

  const handleMenuShow = () => {
    setMenuShow(!menuShow)
  }

  return (
    <div className='homeheader'  ref={menuRef}>
      <div className="homeheader-logo" onClick={() => navigate('/')}>
        <img src={ApusLogo} alt="Apus Logo" />
        <h2 className='homeheader-text'>Apus Network</h2>
      </div>
      <ul className='homeheader-menu' style={menuShow ? { opacity: 1, display: isMobile ? 'block' : 'flex' } : { opacity: 0, display: 'none' }}>
        {
          menu.map(item => (
            <li className={currentMenu === item.name ? 'active' : ''} onClick={() => handleMenuNavigate(item)} key={item.name}>{item.name}</li>
          ))
        }
      </ul>
      <Button className='contact-btn' type='primary'>Contact Us</Button>
      <span className='mobile-menu' onClick={handleMenuShow}>
        <Icon name='Menu' size={35} />
      </span>
    </div>
  )
}

export default HomeHeader