import { FC } from 'react'
import { Button } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import HomeFooter from '../../components/HomeFooter'
import './index.less'

const HomeIndex: FC = (props) => {

  return (
    <div className='home-index'>

      <div className='homeindex-top'>
        <div className='homeindex-top-left'>
          <div className='homeindex-top-left-text'>Scalable, Interoperable, and Secure</div>
          <div className='homeindex-top-left-title'>Edge Computing For AI</div>
          <div className='homeindex-top-left-describe'>AI unleashed: Decentralized Power, Fair Cost, On-Demand for Masses</div>
          <div>
            <Button type='primary' className='homeindex-top-left-btn' style={{ marginRight: 24 }}>
              Explore Features
              <RightOutlined />
            </Button>
            <Button  className='homeindex-top-left-btn'>Read Docs</Button>
          </div>
        </div>
        <div className='homeindex-top-image'>
          image
        </div>
      </div>

      <div className='homeindex-middle'>
        <div className='hoemindex-server'></div>
        <ul className='server-box'>
          <li style={{ background: 'linear-gradient(to bottom, rgba(197, 115, 107, 1), rgba(174, 42, 39, 1))' }}>
            <div className='server-box-name'></div>
            <div className='server-box-value'></div>
          </li>
          <li style={{ background: 'linear-gradient(to bottom, rgba(179, 101, 207, 1), rgba(115, 37, 206, 1))' }}>
            <div className='server-box-name'></div>
            <div className='server-box-value'></div>
          </li>
          <li style={{ background: 'linear-gradient(to bottom, rgba(92, 98, 207, 1), rgba(33, 36, 207, 1))' }}>
            <div className='server-box-name'></div>
            <div className='server-box-value'></div>
          </li>
          <li style={{ background: 'linear-gradient(to bottom, #888ce1, #5e46d1)' }}>
            <div className='server-box-name'></div>
            <div className='server-box-value'></div>
          </li>
        </ul>
      </div>

      <div className='advantage'>
        <div className='home-title'>Advantages</div>
        <div className='home-describe'>To achieve a diversified portfolio, look for asset classes that have low or negative correlations so that if moves down, the other tends to it. ETFs and mutual funds are easy ways to select asset.</div>
        <ul className='advantage-list'>
          <li>
            <div className='advantage-list-head'>
              <img src='/src/assets/deploy.png' />
            </div>
            <div className='advantage-list-title'>Non-Intrusive Deployment</div>
            <div className='advantage-list-describe'>Engineered for simple setup without disrupting existing machine performance, enabling worry-free contributions to AI computations.</div>
          </li>
          <li>
            <div className='advantage-list-head'>
              <img src='/src/assets/scalable.png' />
            </div>
            <div className='advantage-list-title'>Scalable Infrastructure</div>
            <div className='advantage-list-describe'>Designed for scalability to meet dynamic compute demands, ensuring seamless AI processing capabilities as your needs evolve.</div>
          </li>
          <li>
            <div className='advantage-list-head'></div>
            <div className='advantage-list-title'>Democratized Compute Access</div>
            <div className='advantage-list-describe'>Facilitates equitable access to high-performance compute resources, fostering innovation and rewarding participation across the network.</div>
          </li>
          <li>
            <div className='advantage-list-head'></div>
            <div className='advantage-list-title'>Privacy-Centric Network</div>
            <div className='advantage-list-describe'>Embraces a decentralized ethos with transparent, trustless operations and e2e encryption, safeguarding user data and ensuring fairness.</div>
          </li>
        </ul>
      </div>

      <div className='whyus'>
        <div className='home-title'>Why Us</div>
        <div className='home-describe'>To achieve a diversified portfolio, look for asset classes that have low or negative correlations so that if moves down, the other tends to it. ETFs and mutual funds are easy ways to select asset.</div>
        <ul className='whyus-list'>
          <li>
            <div className='whyus-list-img'>
              <img src="/src/assets/pptv.png" />
            </div>
            <div className='whyus-list-text'>450MM Users<br/>Worldwide</div>
          </li>
          <li>
            <div className='whyus-list-img'>
              <img src="/src/assets/ppio.png" />
            </div>
            <div className='whyus-list-text'>5000 Nodes<br/>Worldwide</div>
          </li>
          <li>
            <div className='whyus-list-img'>
              <img src="/src/assets/logo-apus.png" />
            </div>
            <div className='whyus-list-text'>Unlimited Compute<br/>Worldwide</div>
          </li>
        </ul>
      </div>

      <HomeFooter />
    </div>
  )
}

export default HomeIndex