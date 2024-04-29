import { FC, useState } from 'react'
import { Avatar, Button, Card, Col, Table, message } from 'antd'
import type { TableProps } from 'antd';
import './index.less'
import { useWallet } from '@solana/wallet-adapter-react';
import Icon from '@ant-design/icons';
import useSWR from 'swr';
import { solApiFetcher } from '../../contexts/task';

interface DataType {
  id: string;
  invitedBy: string;
  points: number
  solanaAddress: string;
  totalPoints: number;
  username: string;
}

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'User',
    dataIndex: 'id',
    render: (_, { username, solanaAddress }) => {
      username = username || solanaAddress
      const randomColor = ColorList[username?.charCodeAt(username.length - 1) % ColorList.length]
      return <div className='name-row'>
        <Avatar className="avtor" shape="square" style={{ backgroundColor: randomColor}}>{username?.substring(username.length - 5)}</Avatar>
        <div>
          <div className='name'>{username}</div>
          <div className='describe'>{solanaAddress}</div>
        </div>
      </div>
    },
    width: '34%'
  },
  {
    title: 'Points',
    dataIndex: 'points',
    className: 'gray-text'
  },
  {
    title: 'Bouns',
    className: 'blue-text',
    render: (_, { points }) => {
      return <span>{points * 0.15}</span>
    }
  }
]

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    message.success('Copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

const Dashboard: FC = (props) => {
  const { publicKey } = useWallet()

  const referral_link = `${location.origin}/home/index?referral_code=${publicKey?.toBase58()}`

  const { data: pointsData = {} } = useSWR<any>(publicKey && `/points?solanaAddress=${publicKey?.toBase58()}`, solApiFetcher)
  const { data: { totalPoints = 0, points = 0 } = { totalPoints: 0, points: 0 } } = pointsData

  const { data: invitedUsersData = {} } = useSWR<any>(publicKey && `/invited-by?solanaAddress=${publicKey?.toBase58()}`, solApiFetcher)
  const { data: invitedUsers = [] } = invitedUsersData

  return (
    <div className='dashboard'>
      <Card title="" bordered={false}>
        <div className='card-content-title'>Invitation link</div>
        <div className='card-content-block'>
          <span>{referral_link}</span>
          <Button onClick={() => {
            copyToClipboard(referral_link)
          }}>Copy</Button>
        </div>
        <div className='mt-2 text-slate-400'>You will earn <span className=" text-white font-bold">+15%</span> on top of any Points your invites earn.</div>
      </Card>
      <div className='dashboard-show'>
        <div className='dashboard-show-card' style={{ background: 'linear-gradient(to right, rgba(179, 103, 207, 1), rgba(115, 37, 206, 1))' }}>
          <Icon name="Total" size={78} />
          <div className='item'>
            <div className='item-value'>{totalPoints}</div>
            <div className='item-name font-bold'>Total Point</div>
            <div className="mt-1 text-neutral-200 opacity-50">Updated every 1 hour</div>
          </div>
          <span className='link-btn'>
            <Icon name="Link" size={35}></Icon>
          </span>
        </div>

        <div className='dashboard-show-card' style={{ background: 'linear-gradient(to right, rgba(106, 113, 239, 1), rgba(34, 37, 207, 1))' }}>
          <Icon name="Task" size={78} />
          <div className='item'>
            <div className='item-value'>{points}</div>
            <div className='item-name'>Galxe Points</div>
            <div className="mt-1 text-neutral-200 opacity-50">Updated every 1 hour</div>
          </div>
          <span className='link-btn'>
            <Icon name="Link" size={35}></Icon>
          </span>
        </div>

        <div className='dashboard-show-card' style={{ margin: 0, background: 'linear-gradient(to right, rgba(23, 200, 157, 1), rgba(14, 130, 100, 1))' }}>
          <Icon name="Mining" size={78} />
          <div className='item'>
            <div className='item-value'>{totalPoints - points}</div>
            <div className='item-name'>Invite Points</div>
            <div className="mt-1 text-neutral-200 opacity-50">Updated every 1 hour</div>
          </div>
          <span className='link-btn'>
            <Icon name="Link" size={35}></Icon>
          </span>
        </div>
      </div>

      <Table className='dashboard-table' columns={columns} rowKey="id" dataSource={invitedUsers} pagination={false} />
    </div>
  )
}

export default Dashboard