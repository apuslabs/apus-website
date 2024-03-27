import { FC, useState } from 'react'
import { Button, Card } from 'antd'
import './index.less'

const Dashboard: FC = (props) => {
  const [link, setLink] = useState<string>('https://dashboard.apusnetwork.com/register?referral_code-rmytijitmogcx')

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // message.success('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const handleCopy = () => {
    copyToClipboard(link)
  }

  return (
    <div className='dashboard'>
      <Card title="" bordered={false}>
        <div className='card-content-title'>Invitation link</div>
        <div className='card-content-block'>
          <span>{ link }</span>
          <Button onClick={handleCopy}>Copy</Button>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard