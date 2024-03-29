import { FC, useState } from 'react'
import HomeFooter from '../../components/HomeFooter'
import { Input, Table } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import './index.less'

interface DataType {
  key: string;
  user: string;
  agent: string;
  gpuNode: string;
  time: string;
  price: number | string;
  link: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'USER',
    dataIndex: 'user',
  },
  {
    title: 'Agent',
    dataIndex: 'agent',
  },
  {
    title: 'GPU NODE',
    dataIndex: 'gpuNode',
  },
  {
    title: 'TIME',
    dataIndex: 'time',
  },
  {
    title: 'PRICE',
    dataIndex: 'price',
  },
  {
    title: 'SOLANA TX LINK',
    dataIndex: 'link',
  },
]

const Task: FC = (props) => {

  const [listData, setListData] = useState<DataType[]>([
    {
      key: '1',
      user: 'Maryam Amiri',
      agent: '1,566,869,85',
      gpuNode: 'Ay86Ng7XrHGSLt1xZoLdn4fabdHs1C8dyrfSw9i1AFFp',
      time: '2024-03-20 12:00:00',
      price: 2,
      link: 'https://explorer.solana.'
    },
    {
      key: '2',
      user: 'Maryam Amiri',
      agent: '1,566,869,85',
      gpuNode: 'Ay86Ng7XrHGSLt1xZoLdn4fabdHs1C8dyrfSw9i1AFFp',
      time: '2024-03-20 12:00:00',
      price: 2,
      link: 'https://explorer.solana.'
    },
  ])

  return (
    <div className='task'>
      <div className='task-head'>
        <div className='task-head-title'>AI Tasks</div>
        <Input suffix={<SearchOutlined />} size="large" placeholder='Search AI Task Transaction' className='task-input' />
      </div>
      <div className='task-list'>
        <Table className='task-table' columns={columns} dataSource={listData} pagination={false} />
      </div>
      <HomeFooter showCompany={false} />
    </div>
  )
}

export default Task