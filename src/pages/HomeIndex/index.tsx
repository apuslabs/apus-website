import { FC, useEffect, useLayoutEffect } from 'react'
import { Button } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import HomeFooter from '../../components/HomeFooter'
import { Icon } from '../../components/SvgIcon'
import './index.less'
import { solApiFetcher, useStatistics } from '../../contexts/task'
import { AdvantageDemocratize, AdvantageNetwork, ApusLogo, Deploy, PPIO, PPTV, Scalable } from '../../assets/image'
import { useNavigate, useLocation } from 'react-router-dom'
import QueryString from 'qs'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

const HomeIndex: FC = () => {
  const {
    gpuCount,
    taskCount,
    agentCount,
    payoutCount
  } = useStatistics()

  const navigate = useNavigate()

  const location = useLocation()

  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  useLayoutEffect(() => {
    const t = setTimeout(() => {
      const query = QueryString.parse(location.search, { ignoreQueryPrefix: true })
      if ('referral_code' in query) {
        if (!connected) {
          setVisible(true)
        } else {
          solApiFetcher.post('/invite-by', {
            solanaAddress: publicKey?.toBase58(),
            invitedBy: query.referral_code
          })
        }
      }
    }, 1000)
    return () => {
      clearTimeout(t)
    }
  }, [location.search, connected, publicKey])

  return (
    <div className='home-index'>

      <div className='homeindex-top'>
        <div className='homeindex-top-left'>
          {/* <div className='homeindex-top-left-text'>Scalable, Interoperable, and Secure</div> */}
          <div className='homeindex-top-left-title'>DePIN + AI Agents</div>
          <div className='homeindex-top-left-describe'>Empower a decentralized AI agents ecosystem and boost AI democratization!</div>
          <div>
            <Button type='primary' className='homeindex-top-left-btn' style={{ marginRight: 24, marginBottom: 24 }} onClick={() => {
              navigate('/app/workers/new')
            }}>
              Provide Your GPU
              <RightOutlined />
            </Button>
            <Button  className='homeindex-top-left-btn' style={{ marginBottom: 24 }} onClick={() => {
              navigate('/app/aiAgents')
            }}>Publish Your Agents</Button>
          </div>
        </div>
        <div className='homeindex-top-image'>
          
        </div>
      </div>

      <div className='homeindex-middle'>
        <div className='hoemindex-server'></div>
        <ul className='server-box'>
          <li style={{ background: 'linear-gradient(to bottom, rgba(197, 115, 107, 1), rgba(174, 42, 39, 1))' }}>
            <div className='server-box-img'>
              <Icon name='GPU' size={112} />
            </div>
            <div className='server-box-name'>GPUs</div>
            <div className='server-box-value'>{gpuCount}</div>
          </li>
          <li style={{ background: 'linear-gradient(to bottom, rgba(179, 101, 207, 1), rgba(115, 37, 206, 1))' }}>
            <div className='server-box-img'>
              <Icon name='AiAgent' size={80} />
            </div>
            <div className='server-box-name'>AI Agents</div>
            <div className='server-box-value'>{agentCount}</div>
          </li>
          <li style={{ background: 'linear-gradient(to bottom, rgba(92, 98, 207, 1), rgba(33, 36, 207, 1))' }}>
            <div className='server-box-img'>
              <Icon name='AiTask' size={80} />
            </div>
            <div className='server-box-name'>AI Tasks</div>
            <div className='server-box-value'>{taskCount}</div>
          </li>
          <li style={{ background: 'linear-gradient(to bottom, #888ce1, #5e46d1)' }}>
            <div className='server-box-img'>
              <Icon name='Payout' size={80} />
            </div>
            <div className='server-box-name'>Network Payout</div>
            <div className='server-box-value'>{payoutCount}</div>
          </li>
        </ul>
      </div>

      <div className='advantage'>
        <div className='home-title'>Benifits</div>
        <ul className='advantage-list'>
          <li>
            <div className='advantage-list-head'>
              <img src={Deploy} />
            </div>
            <div className='advantage-list-title'>Affordability</div>
            <div className='advantage-list-describe'>Cost-effective AI, making cutting-edge technology accessible.</div>
          </li>
          <li>
            <div className='advantage-list-head'>
              <img src={Scalable} />
            </div>
            <div className='advantage-list-title'>Transparent Transactions</div>
            <div className='advantage-list-describe'>Clear, honest engagements ensuring transaction integrity.</div>
          </li>
          <li>
            <div className='advantage-list-head'>
              <img src={AdvantageDemocratize} />
            </div>
            <div className='advantage-list-title'>Ownership Protection</div>
            <div className='advantage-list-describe'>Safeguarding intellectual contributions with robust protections.</div>
          </li>
          <li>
            <div className='advantage-list-head'>
              <img src={AdvantageNetwork} />
            </div>
            <div className='advantage-list-title'>Global Compute Marketplace</div>
            <div className='advantage-list-describe'>Connecting global Compute resources for fair access.</div>
          </li>
        </ul>
      </div>

      <div className='whyus'>
        <div className='whyus-bg'></div>
        <div className='home-title'>Why Us</div>
        <ul className='whyus-list'>
          <li>
            <div className='whyus-list-img'>
              <img src={PPTV}/>
            </div>
            <div className='whyus-list-text'>450MM Users</div>
          </li>
          <li>
            <div className='whyus-list-img'>
              <img src={PPIO} />
            </div>
            <div className='whyus-list-text'>5000 Nodes</div>
          </li>
          <li>
            <div className='whyus-list-img'>
              <img src={ApusLogo} />
            </div>
            <div className='whyus-list-text'>Unlimited Compute</div>
          </li>
        </ul>
      </div>

      <HomeFooter />
    </div>
  )
}

export default HomeIndex