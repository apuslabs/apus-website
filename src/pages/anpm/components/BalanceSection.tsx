import { useContext } from 'react';
import { balanceIcon } from '../assets';
import { getCreditIcon, stakeApusIcon, transferIcon } from '../assets';
import { BalanceButton } from './BalanceButton';
import { BalanceContext } from '../contexts/balance';
import { formatApus } from '../../../utils/utils';

const BalanceSection = () => {
  const {balance, credits} = useContext(BalanceContext);

  return (
    <div className="box flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[#262626] text-base">Balance</h2>
        <img src={balanceIcon} alt="Balance" className="w-5 h-5" />
      </div>
      
      <div className="space-y-1">
        <p className="text-[#262626] text-sm"><span className='font-bold'>APUS:</span> {formatApus(balance)}</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>Credits:</span> {credits}</p>
      </div>

      <div className="flex flex-col gap-[10px]">
        <BalanceButton name="Get CREDIT" icon={getCreditIcon} to="/anpm/buy-credit" />
        <BalanceButton name="Stake APUS" icon={stakeApusIcon} to="/anpm/stake-apus" />
        <BalanceButton name="Transfer CREDIT" icon={transferIcon} to="/anpm/transfer-credit" />
      </div>
    </div>
  );
};

export default BalanceSection;
