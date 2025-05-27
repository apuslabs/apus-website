import { useContext } from 'react';
import { balanceIcon, chatIcon, overviewIcon, processIcon, getCreditIcon, stakeApusIcon } from '../assets';
import { BalanceButton } from './BalanceButton';
import { BalanceContext } from '../contexts/balance';
import { formatApus, formatCredits } from '../../../utils/utils';
import { useLocation } from 'react-router-dom';

const BalanceSection = () => {
  const location = useLocation()
  const {balance, credits} = useContext(BalanceContext);

  return (
    <div className="box flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[#262626] text-base">Balance</h2>
        <img src={balanceIcon} alt="Balance" className="w-5 h-5" />
      </div>
      
      <div className="space-y-1">
        <p className="text-[#262626] text-sm"><span className='font-bold'>APUS:</span> {formatApus(balance)}</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>Credits:</span> {formatCredits(credits)}</p>
      </div>

      <div className="flex flex-col gap-[20px]">
        {[
          { name: "Overview", icon: overviewIcon, to: "/anpm/console" },
          { name: "Get CREDIT", icon: getCreditIcon, to: "/anpm/buy-credit" },
          { name: "Stake/Withdraw", icon: stakeApusIcon, to: "/anpm/stake" },
          { name: "Chat Playground", icon: chatIcon, to: "/anpm/chat" },
          { name: "Process ID", icon: processIcon, to: "/anpm/process" }
        ].map((button, index) =>
          <BalanceButton
            key={index}
            name={button.name}
            icon={button.icon}
            to={button.to}
            className='w-full'
            active={location.pathname === button.to}
          />
        )
        }
      </div>
    </div>
  );
};

export default BalanceSection;
