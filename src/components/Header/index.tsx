import { FC } from 'react'
import { ApusLogo } from "../../assets/image";
import Breadcrumb from '../Breadcrumb'
import './index.less'
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header: FC = () => {
  const navigate = useNavigate()
  const { connected, publicKey } = useWallet()

  return (
    <div className='header'>
      <div className="header-logo">
        <img src={ApusLogo} alt="Apus Logo" onClick={() => {
          navigate('/')
        }} />
        <h2 className='header-text'>Apus Network</h2>
      </div>
      <div className='header-right'>
        <Breadcrumb />
      </div>
      <div>
      {connected ? <span>{publicKey?.toBase58()}</span> : <WalletMultiButton />}
      </div>
    </div>
  )
}

export default Header