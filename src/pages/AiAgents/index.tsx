import { FC, useState } from 'react'
import { Input, Radio, Progress, Button, InputNumber, message } from 'antd'
import './index.less'
import { solApiFetcher } from '../../contexts/task'
import { useWallet } from '@solana/wallet-adapter-react'

const TypeList = [
  { name: 'LLM', value: 1 },
  { name: 'Image', value: 2 },
  { name: 'Audio', value: 3 },
  { name: 'Video', value: 4 },
]

const Card = (props: any) => {
  return (
    <div className='form-card' style={props.style}>
      <div className='form-card-title'>{ props.title }</div>
      { props.children }
    </div>
  )
}

const deafultAgent = () => ({
  title: '',
  desc: '',
  dockerImageLink: '',
  poster: '',
  category: '',
  apiDoc: '',
  dockerDefaultPort: 9000,
  price: 10,
})

const AiAgent: FC = () => {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)
  const [agent, setAgent] = useState(deafultAgent())

  return (
    <div className='ai'>
      <Card title="Agent name">
        <Input size='large' />
      </Card>
      <Card title="Type">
        <Radio.Group onChange={e => {
          setAgent(agent => ({
            ...agent,
            category: e.target.value
          }))
        }}>
          {
            TypeList.map(item => <Radio key={item.value} value={item.value}>{item.name}</Radio>)
          }
        </Radio.Group>
      </Card>
      <Card title="Description" style={{width: '100%'}}>
        <Input.TextArea rows={4} onChange={e => {
          setAgent(agent => ({
            ...agent,
            desc: e.target.value
          }))
        }} />
      </Card>
      <Card title="Docker Image">
        <Input size='large' onChange={e => {
          setAgent(agent => ({
            ...agent,
            dockerImageLink: e.target.value
          }))
        }} />
      </Card>
      <Card title="Agent Logo">
        <Input size='large' onChange={e => {
          setAgent(agent => ({
            ...agent,
            poster: e.target.value
          }))
        }} />
      </Card>
      <Card title="Agent Port">
        <InputNumber size='large' style={{
          width: '100%'
        }} onChange={e => {
          setAgent(agent => ({
            ...agent,
            dockerDefaultPort: Number(e)
          }))
        }} />
      </Card>
      <Card title="Api Docs">
        <Input size='large' onChange={e => {
          setAgent(agent => ({
            ...agent,
            apiDoc: e.target.value
          }))
        }} />
      </Card>
      <Card title="Price">
        <InputNumber size='large' style={{
          width: '100%'
        }} onChange={e => {
          setAgent(agent => ({
            ...agent,
            price: Number(e)
          }))
        }} />
      </Card>
      <Button type='primary' style={{border: 'unset'}} block size='large' loading={loading} onClick={() => {
        if (loading) return
        setLoading(true)
        solApiFetcher.post('/register-agent', {
          ...agent,
          agentOwner: publicKey?.toBase58()
        }).then(res => {
          message.success('Agent created successfully')
          setAgent(deafultAgent())
        }).catch(e => {
          message.error('Failed to create agent')
        }).finally(() => {
          setLoading(false)
        })
      }}>Submit</Button>
    </div>
  )
}

export default AiAgent