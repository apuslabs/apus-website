import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import "./App.less";
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import MenuList from './config/menu'
import Dashboard from './pages/Dashboard'
import Works from './pages/Works'
import AiAgents from './pages/AiAgents'
import WorkNew from './pages/Works/workNew'
import menuList from './config/menu';

function App() {
  const [current, setCurrent] = useState('dashboard')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const { pathname } = location
    const current = menuList.find(item => pathname.includes(item.key))
    setCurrent(current!.key)
  }, [])

  const handleMenuChange = ({ key }: { key: string }) => {
    setCurrent(key)
    navigate(`/${key}`)
  }

  return (
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
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" key="dashboard" element={<Dashboard />} />
            <Route path="/works">
              <Route index element={<Works />}></Route>
              <Route path='/works/new' element={<WorkNew />} />
            </Route>
            <Route path="/aiAgents" element={<AiAgents />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
