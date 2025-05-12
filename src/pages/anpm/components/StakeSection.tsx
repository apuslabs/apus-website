import { getCreditIcon, stakeApusIcon } from '../assets';
import { BalanceButton } from './BalanceButton';

const BalanceSection = () => {
  return (
    <div className="box flex flex-col gap-5">
      <div className="space-y-1">
        <p className="text-[#262626] text-sm"><span className='font-bold'>Staked:</span>44,234.56</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>Pool:</span>Name of the staking...</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>APR:</span>7%</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>Earned:</span>128</p>
      </div>

      <div className="flex flex-col gap-[10px]">
        <BalanceButton name="Claim APUS" icon={getCreditIcon} to="/anpm/claim-apus" />
        <BalanceButton name="Withdraw APUS" icon={stakeApusIcon} to="/anpm/withdraw-apus" />
      </div>
    </div>
  );
};

export default BalanceSection;
