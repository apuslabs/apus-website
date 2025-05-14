import { ANPM_DEFAULT_POOL } from '../../../utils/config';
import { getCreditIcon, stakeApusIcon } from '../assets';
import { BalanceButton } from './BalanceButton';

const BalanceSection = ({
  staked,
}: {
  staked: string;
}) => {
  return (
    <div className="box flex flex-col gap-5">
      <div className="space-y-1">
        <p className="text-[#262626] text-sm"><span className='font-bold'>Staked:</span>{staked}</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>Pool:</span>{ANPM_DEFAULT_POOL.Name}</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>APR:</span>{ANPM_DEFAULT_POOL.APR}%</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>Earned:</span>0</p>
      </div>

      <div className="flex flex-col gap-[10px]">
        <BalanceButton name="Claim APUS" icon={getCreditIcon} to="/anpm/claim-apus" />
        <BalanceButton name="Withdraw APUS" icon={stakeApusIcon} to="/anpm/withdraw-apus" />
      </div>
    </div>
  );
};

export default BalanceSection;
