import { FC, useState } from 'react'
import HomeFooter from '../../components/HomeFooter'
import { Input, Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import './index.less'
import { useTaskList } from '../../contexts/task';

interface DataType {
  key: string;
  user: string;
  agent: string;
  gpuNode: string;
  time: string;
  price: number | string;
  link: string
}

function shortAddress(address: string) {
  return <Tooltip title={address}>{`${address.slice(0, 4)}...${address.slice(-4)}`}</Tooltip>
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Task ID',
    dataIndex: 'id',
    render: (r: string) => {
      return <Tooltip title={r}>{`${r.slice(0, 6)}...`}</Tooltip>
    }
  },
  {
    title: 'Payer Address',
    dataIndex: 'payer',
    render: (r: string) => {
      return shortAddress(r)
    }
  },
  {
    title: 'Agent ID',
    dataIndex: 'agentId',
  },
  {
    title: 'GPU Node ID',
    dataIndex: 'gpuNodeId',
  },
  {
    title: 'Time',
    dataIndex: 'timestamp',
  },
  {
    title: 'Agent Fee',
    dataIndex: 'agentFee',
  },
  {
    title: 'GPU Node Fee',
    dataIndex: 'gpuNodeFee',
  },
  {
    title: 'Solana Tx Link',
    dataIndex: 'key',
    render: (r: string) => {
      return <a href={`https://explorer.solana.com/address/${r}?cluster=devnet`} target='_blank'>Explorer</a>
    }
  },
]

const Task: FC = (props) => {
  const [search, setSearch] = useState<string>('')
  const [formData, setFormData] = useState<string | undefined>()
  const [taskList] = useTaskList(formData)

  return (
    <div className='task'>
      <div className='task-head'>
        <div className='task-head-title'>AI Tasks</div>
        <Input suffix={<SearchOutlined onClick={() => setFormData(search)} />} size="large" placeholder='Search AI Task Transaction' className='task-input' onChange={e => {
          setSearch(e.target.value)
        }} />
      </div>
      <div className='task-list'>
        <Table className='task-table' columns={columns} dataSource={taskList} pagination={false} />
      </div>
      <HomeFooter showCompany={false} />
    </div>
  )
}

export default Task