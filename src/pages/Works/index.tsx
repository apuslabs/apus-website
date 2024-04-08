import { FC } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import './index.less'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGpuNodeList } from '../../contexts/task'

const Home: FC = () => {
  const navigate = useNavigate()

  const [gpuNodeList] = useGpuNodeList()

  const handleToWorkNew = () => {
    navigate('/app/workers/new')
  }

  return (
    <div className='works'>
      <div className='works-header'>
        <Button type='primary' style={{border: 'unset'}} onClick={handleToWorkNew}>Run New GPU</Button>
      </div>
      <div className='works-body'>
        {gpuNodeList.map((gpuNode: any) => {
          return <div className='works-item' key={gpuNode.id}>
          <div className='works-item-header'>{gpuNode.id}</div>
          <ul className='works-item-content'>
            <li>
              <div className='item-title'>Status</div>
              <div className='item-value' style={{
                color: gpuNode.status === 'Online' ? 'green' : 'red'
              }}>{gpuNode.status}</div>
            </li>
            {/* <li>
              <div className='item-title'>Type</div>
              <div className='item-value'>{Offline}</div>
            </li>
            <li>
              <div className='item-title'>Platform</div>
              <div className='item-value'>Offline</div>
            </li>
            <li>
              <div className='item-title'>IP Address</div>
              <div className='item-value'>Offline</div>
            </li> */}
            <li>
              <div className='item-title'>CPU</div>
              <div className='item-value'>{gpuNode.cpuCores}</div>
            </li>
            <li>
              <div className='item-title'>Memory MB</div>
              <div className='item-value'>{gpuNode.memory}</div>
            </li>
            <li>
              <div className='item-title'>Storage GB</div>
              <div className='item-value'>{gpuNode.storage}</div>
            </li>
            <li>
              <div className='item-title'>GPU Model</div>
              <div className='item-value'>{gpuNode.gpuCardModel}</div>
            </li>
            <li>
              <div className='item-title'>Price</div>
              <div className='item-value'>{gpuNode.price}</div>
            </li>
            <li>
              <div className='item-title'>24 Hour Tasks</div>
              <div className='item-value'></div>
            </li>
            <li>
              <div className='item-title'>All time Payout</div>
              <div className='item-value'></div>
            </li>
          </ul>
        </div>
        })}
      </div>
    </div>
  )
}

export default Home