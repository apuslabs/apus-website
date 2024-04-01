import { FC, useState } from 'react'
import { Button, Card } from 'antd'
import type { TableProps } from 'antd';
import './index.less'
import { useWallet } from '@solana/wallet-adapter-react';

interface DataType {
  key: string;
  name: string;
  points: string;
  bouns: number;
}

// const columns: TableProps<DataType>['columns'] = [
//   {
//     title: 'NAME',
//     dataIndex: 'name',
//     render: (text, record) => (
//       <div className='name-row'>
//         <div className='avtor'></div>
//         <div>
//           <div className='name'>{record.name}</div>
//           <div className='describe'>maryamamiri01</div>
//         </div>
//       </div>
//     ),
//     width: '34%'
//   },
//   {
//     title: 'POINTS',
//     dataIndex: 'points',
//     className: 'gray-text'
//   },
//   {
//     title: 'BOUNS',
//     dataIndex: 'bouns',
//     className: 'blue-text'
//   }
// ]

const Dashboard: FC = (props) => {
  const {publicKey} = useWallet()
  // const [listData, setListData] = useState<DataType[]>([
  //   {
  //     key: '1',
  //     name: 'Maryam Amiri',
  //     points: '1,566,869,85',
  //     bouns: 1.25
  //   },
  //   {
  //     key: '2',
  //     name: 'Maryam Amiri2',
  //     points: '1,566,869,85',
  //     bouns: 1.25
  //   },
  // ])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // message.success('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const handleCopy = () => {
    copyToClipboard(`https://playground.apus.network?referral_code=${publicKey?.toBase58()}`)
  }

  return (
    <div className='dashboard'>
      <Card title="" bordered={false}>
        <div className='card-content-title'>Invitation link</div>
        <div className='card-content-block'>
          <span>{`https://playground.apus.network?referral_code=${publicKey?.toBase58()}`}</span>
          <Button onClick={handleCopy}>Copy</Button>
        </div>
      </Card>
      {/* <div className='dashboard-show'>
        <div className='dashboard-show-card' style={{ background: 'linear-gradient(to right, rgba(179, 103, 207, 1), rgba(115, 37, 206, 1))' }}>
          <Icon name="Total" size={78} />
          <div className='item'>
            <div className='item-value'>31</div>
            <div className='item-name'>Total Point</div>
          </div>
          <span className='link-btn'>
            <Icon name="Link" size={35}></Icon>
          </span>
        </div>

        <div className='dashboard-show-card' style={{ background: 'linear-gradient(to right, rgba(106, 113, 239, 1), rgba(34, 37, 207, 1))' }}>
          <Icon name="Task" size={78} />
          <div className='item'>
            <div className='item-value'>31</div>
            <div className='item-name'>Task Point</div>
          </div>
          <span className='link-btn'>
            <Icon name="Link" size={35}></Icon>
          </span>
        </div>

        <div className='dashboard-show-card' style={{ margin: 0, background: 'linear-gradient(to right, rgba(23, 200, 157, 1), rgba(14, 130, 100, 1))' }}>
          <Icon name="Mining" size={78} />
          <div className='item'>
            <div className='item-value'>31</div>
            <div className='item-name'>Mining Point</div>
          </div>
          <span className='link-btn'>
            <Icon name="Link" size={35}></Icon>
          </span>
        </div>
      </div> */}

      {/* <Table className='dashboard-table' columns={columns} dataSource={listData} pagination={false} /> */}
    </div>
  )
}

export default Dashboard