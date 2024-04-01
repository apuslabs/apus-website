import { FC, useState } from 'react'
import { Button, Card, Input, InputNumber, Typography } from 'antd'
import './index.less'
import { useWallet } from '@solana/wallet-adapter-react';

const { TextArea } = Input;

const Home: FC = (props) => {

  const { publicKey } = useWallet()
  const [price, setPrice] = useState<number>(10)

  return (
    <div className='newWork'>
      <Card title="1. Fill nodeinfo" bordered={false}>
        <div className='card-content-title'>Price</div>
        <InputNumber size='large' style={{
          width: '100%'
        }} value={price} onChange={e => {
          setPrice(e ?? 0)
        }} />
      </Card>

      <Card title="1. Prerequisites" bordered={false} style={{marginTop: '16px'}}>
        <div className='card-content-title'>Download the setup script</div>
        <Card size='small'><Typography.Text copyable>curl -L https://github.com/apuslabs/solana-hackthon-cli/raw/main/apus-setup.sh -o apus-setup.sh</Typography.Text></Card>
        <div className='card-content-title title-second'>Run the script</div>
        <Card size='small'>
          <Typography.Text copyable>chmod +x apus-setup.sh && ./apus-setup.sh</Typography.Text>
        </Card>
      </Card>

      <Card title="2. Start the containers using binary" bordered={false} style={{marginTop: '16px'}}>
        <div className='card-content-title'>Run the command to download binary</div>
        <Card size='small'>
          <Typography.Text copyable>curl -L https://github.com/apuslabs/solana-hackthon-cli/raw/main/solana-hackthon-cli -o solana-hackthon-cli</Typography.Text>
        </Card>
        <div className='card-content-title title-second'>Run the command to launch binary</div>
        <Card size='small'>
          <Typography.Text copyable>chmod +x solana-hackthon-cli</Typography.Text>
        </Card>
        <div className='card-content-title title-second'>Run the command to connect device</div>
        <Card size='small'>
          <Typography.Text copyable>nohup ./solana-hackthon-cli --ownerpubkey {publicKey?.toBase58() ?? ''} --price {price} log.txt 2&gt;&1 &</Typography.Text>
        </Card>
        <div className='card-content-title title-second'>You can also run it in background</div>

      </Card>

      <Card title="3. Wait for Connection" bordered={false} style={{marginTop: '16px'}}>
        <div className='card-content-title'>Wait until your cli init finished and show <code>Listening and serving HTTP on 0.0.0.0:80</code>!</div>
        <div className='card-content-title'>In case your device won't connect, Contact out support or refer to our discord support channel.</div>
        <Button type='primary'  style={{border: 'unset'}} block>Go back to List</Button>
      </Card>
    </div>
  )
}

export default Home