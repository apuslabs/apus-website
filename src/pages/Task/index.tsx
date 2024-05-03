import { FC, useState } from 'react'
import HomeFooter from '../../components/HomeFooter'
import { Table, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import './index.less'
import { useTaskList } from '../../contexts/task';
import { tokenFormatter } from '../../utils/formatter';

interface DataType {
  id: string;
  payer: string;
  agentId: string;
  gpuNodeId: string;
  timestamp: string;
  agentFee: number;
  gpuNodeFee: number;
  status: 'pending' | 'completed';
  key: string
}

function shortAddress(address: string) {
  return <Tooltip title={address}>{`${address.slice(0, 4)}...${address.slice(-4)}`}</Tooltip>
}

function shortId(id: string) {
  return <Tooltip title={id}>{`${id.slice(0, 6)}...`}</Tooltip>
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Task ID',
    dataIndex: 'id',
    render: (r: string) => {
      return shortId(r)
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
    render: (r: string) => {
      return shortId(r)
    }
  },
  {
    title: 'GPU Node ID',
    dataIndex: 'gpuNodeId',
    render: (r: string) => {
      return shortId(r)
    }
  },
  // {
  //   title: 'Time',
  //   dataIndex: 'timestamp',
  // },
  {
    title: 'Agent Fee',
    dataIndex: 'agentFee',
    render: (r: number) => {
      return tokenFormatter.format(r / 10 ** 9)
    }
  },
  {
    title: 'GPU Node Fee',
    dataIndex: 'gpuNodeFee',
    render: (r: number) => {
      return tokenFormatter.format(r / 10 ** 9)
    }
  },
  // {
  //   title: 'Dapp Fee',
  //   render: () => {
  //     return 0
  //   }
  // },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (r: string) => {
      return <span style={{
        color: r === 'pending' ? 'red' : 'green'
      }}>{r}</span>
    }
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
        {/* <Input suffix={<SearchOutlined onClick={() => setFormData(search)} />} size="large" placeholder='Search AI Task Transaction' className='task-input' onChange={e => {
          setSearch(e.target.value)
        }} /> */}
      </div>
      <div className='task-list'>
        <Table className='task-table' columns={columns} dataSource={taskList} />
      </div>
      <HomeFooter showCompany={false} />
    </div>
  )
}

export default Task