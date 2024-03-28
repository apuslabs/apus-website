import { FC } from 'react'
import { Button, Card, Input } from 'antd'
import './index.less'

const { TextArea } = Input;

const Home: FC = (props) => {

  return (
    <div className='newWork'>
      <Card title="1. Name your node" bordered={false}>
        <div className='card-content-title'>Node name</div>
        <Input size='large' />
      </Card>

      <Card title="2. Prerequisites" bordered={false} style={{marginTop: '16px'}}>
        <div className='card-content-title'>Download the setup script</div>
        <Input size='large' />
        <div className='card-content-title title-second'>Run the script</div>
        <Input size='large' />
      </Card>

      <Card title="3. Start the containers using binary" bordered={false} style={{marginTop: '16px'}}>
        <div className='card-content-title'>Run the command to download binary</div>
        <Input size='large' />
        <div className='card-content-title title-second'>Run the command to launch binary</div>
        <Input size='large' />
        <div className='card-content-title title-second'>Run the command to connect device</div>
        <TextArea size='large' rows={2} />
      </Card>

      <Card title="4. Wait for Connection" bordered={false} style={{marginTop: '16px'}}>
        <div className='card-content-title'>In case your device won't connect, Contact out support or refer to our discord support channel.</div>
        <Button type='primary'  style={{border: 'unset'}} block>Refresh</Button>
      </Card>
    </div>
  )
}

export default Home