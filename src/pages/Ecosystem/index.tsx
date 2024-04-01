import { FC } from 'react'
import HomeFooter from '../../components/HomeFooter'
import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import './index.less'
import { useAgentList } from '../../contexts/task'

const Ecosystem: FC = () => {

  const [agentList] = useAgentList()

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
              <img src='https://cdn4.iconfinder.com/data/icons/kindergarten/100/Artboard_5-1024.png' />
            </div>
            <div className='li-dapp-title'>Text2Image Playground</div>
            <div className='li-dapp-describe'>Novita Agent, hosting the best Stable Diffusion models.</div>
            <Button type='primary' className='li-dapp-btn' onClick={() => {
              window.open('https://playground.apus.network/')
            }}>Open Now <RightOutlined/></Button>
          </li>
          {
            agentList.map((agent: any) => {
              return <li className='li-aiagent'>
              <div className='li-head'>
                <img src={agent.poster ?? '/src/assets/logo-apus.png'} />
              </div>
              <div className='li-aiagent-title'>{agent.title} <span style={{
                opacity: '80%'
              }}>(APTs {agent.price})</span></div>
              <div className='li-aiagent-link'>{agent.id}</div>
              <div className='li-aiagent-link'>Owned by <Tooltip title={agent.owner}>{agent.owner.substr(0,4)}</Tooltip> <a href={agent.apiDoc}>Docs</a></div>
              <div className='li-aiagent-describe'>{agent.desc} </div>
            </li>
            })
          }
          
        </ul>
      </div>
      <HomeFooter />
    </div>
  )
}

export default Ecosystem