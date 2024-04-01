import { FC } from 'react'
import { Input, Radio, Progress, Button } from 'antd'
import './index.less'

const TypeList = [
  { name: 'LLM', value: 1 },
  { name: 'Image', value: 2 },
  { name: 'Audio', value: 3 },
  { name: 'Video', value: 4 },
]

const Card = (props) => {
  return (
    <div className='form-card' style={props.style}>
      <div className='form-card-title'>{ props.title }</div>
      { props.children }
    </div>
  )
}

const AiAgent: FC = () => {

  return (
    <div className='ai'>
      <Card title="Agent name">
        <Input size='large' />
      </Card>
      <Card title="Type">
        <Radio.Group>
          {
            TypeList.map(item => <Radio value={item.value}>{item.name}</Radio>)
          }
        </Radio.Group>
      </Card>
      <Card title="Description" style={{width: '100%'}}>
        <Input.TextArea rows={4} />
      </Card>
      <Card title="Docker Image">
        <Input size='large' />
      </Card>
      <Card title="Agent Logo">
        <Input size='large' />
      </Card>
      <Card title="Agent Port">
        <Input size='large' />
      </Card>
      <Card title="Api Protocol">
        <Input size='large' />
      </Card>
      <Card title="Api Docs">
        <Input size='large' />
      </Card>
      <Card title="Revenue Split">
        <Progress percent={30} />
      </Card>
      <Button type='primary' style={{border: 'unset'}} block size='large'>Submit</Button>
    </div>
  )
}

export default AiAgent