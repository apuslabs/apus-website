import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import themeToken from '../../utils/homeTheme'
import HomeHeader from '../../components/HomeHeader'
import './index.less'

const Home: FC = () => {

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, ...themeToken }}>
      <div className='home-box'>
        <HomeHeader />
        <Outlet />
      </div>
    </ConfigProvider>
    
  )
}

export default Home