import { RouterProvider } from 'react-router-dom'
import "./App.css";
import router from './config/router'
import { Menu } from 'antd'
import { useState } from 'react'
import Header from './components/Header'

function App() {
  const [current, setCurrent] = useState('1')

  return (
    <div>
      <Header />
      <Menu
        theme="dark"
        style={{ width: 256 }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={[]}
      />
      <div className='container'>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
