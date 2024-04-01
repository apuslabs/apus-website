import { FC } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import './index.less'

const Home: FC = (props) => {
  const navigate = useNavigate()

  const handleToWorkNew = () => {
    navigate('/app/works/new')
  }

  return (
    <div className='works'>
      <div className='works-header'>
        <Button type='primary' style={{border: 'unset'}} onClick={handleToWorkNew}>Run New GPU</Button>
      </div>
      <div className='works-body'>
        <div className='works-item'>
          <div className='works-item-header'>Jaxs-MBP</div>
          <ul className='works-item-content'>
            <li>
              <div className='item-title'>Status</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>Type</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>Platform</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>IP Address</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>CPU</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>Memory GB</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>GPU Model</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>GPU Memory</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>Memory GB</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>24 Hours Requests</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>24 Hour Payout</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>All time Payout</div>
              <div className='item-value'>Offline</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home