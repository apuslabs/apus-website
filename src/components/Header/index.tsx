import { FC, useEffect, useLayoutEffect } from 'react'
import { ApusLogo } from "../../assets/image";
import Breadcrumb from '../Breadcrumb'
import './index.less'
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnect } from '../../contexts/wallet';

const Header: FC = () => {
  const navigate = useNavigate()
  const { connected, publicKey } = useWallet()

  const { check } = useConnect()

  useLayoutEffect(() => {
    const t = setTimeout(() => {
      check()
    }, 1000);
    return () => {
      clearTimeout(t)
    }
  }, [check])

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