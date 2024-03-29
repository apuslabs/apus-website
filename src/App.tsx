import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import "./App.less";
import { ConfigProvider, theme, Menu } from 'antd'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import MenuList from './config/menu'
import themeToken from './utils/appTheme.ts'

function App() {
  const [current, setCurrent] = useState('dashboard')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const { pathname } = location
    const current = MenuList.find(item => pathname.includes(item.key))
    if (current) {
      setCurrent(current!.key)
    }
  }, [])

  const handleMenuChange = ({ key }: { key: string }) => {
    setCurrent(key)
    const path = MenuList.find(item => item.key === key)?.path
    navigate(path || '')
  }

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, ...themeToken }}>
      <div className='container-box'>
        <Header />
        <div className='container'>
          <Menu
            theme="dark"
            style={{ width: 375 }}
            defaultOpenKeys={['sub1']}
            selectedKeys={[current]}
            mode="inline"
            items={MenuList}
            onClick={handleMenuChange}
          />
          <div className='container-bg'>
            <Outlet />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
