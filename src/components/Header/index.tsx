import { FC } from 'react'
import { ApusLogo } from "../../assets/image";
import Breadcrumb from '../Breadcrumb'
import './index.less'

const Header: FC = (props) => {

  return (
    <div className='header'>
      <div className="header-logo">
        <img src={ApusLogo} alt="Apus Logo" />
        <h2 className='header-text'>Apus Network</h2>
      </div>
      <div className='header-right'>
        <Breadcrumb />
      </div>
    </div>
  )
}

export default Header