import { FC } from 'react'
import HomeFooter from '../../components/HomeFooter'
import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import './index.less'

const Ecosystem: FC = (props) => {

  return (
    <div className='ecosystem'>
      <div className='ecosystem-title'>Explore a range of AI Dapps<br />and  Ai agents in the Apus Network Ecosystem.</div>
      <div className='project-box'>
        <ul>
          <li className='li-add'>
            <div className='li-head'>
              <PlusOutlined />
            </div>
            <div className='li-add-text'>Add or update your project</div>
          </li>
          <li className='li-dapp'>
            <div className='li-head'>
              <img src='/src/assets/logo-apus.png' />
            </div>
            <div className='li-dapp-title'>Imagine Playground</div>
            <div className='li-dapp-describe'>Free image generator, hosting the best Stable Diffusion models.</div>
            <Button type='primary' className='li-dapp-btn'>Open Now <RightOutlined/></Button>
          </li>
          <li className='li-aiagent'>
            <div className='li-head'>
              <img src='/src/assets/logo-apus.png' />
            </div>
            <div className='li-aiagent-title'>Revenue_Split ($ 20%)</div>
            <div className='li-aiagent-img'></div>
            <div className='li-aiagent-link'>www.docs.xxxx.com</div>
            <div className='li-aiagent-describe'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </div>
          </li>
        </ul>
      </div>
      <HomeFooter />
    </div>
  )
}

export default Ecosystem