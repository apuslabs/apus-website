import { formatApus, formatCredits } from '../../../utils/utils';
import { Pool } from '../contexts/request';

const BalanceSection = ({
  staked,
  interest,
  name,
  apr,
}: Partial<Pool> & {
  staked: string;
  interest: string;
}) => {
  return (
    <div className="w-full bg-[#121212] p-6 mb-10 flex flex-col gap-1 rounded-lg">
      <div className="space-y-1 text-sm text-white">
        <p><span className='font-bold'>Staked: </span>{formatApus(staked)}</p>
        <p><span className='font-bold'>Pool: </span>{name}</p>
        <p><span className='font-bold'>APR: </span>{apr}%</p>
        <p><span className='font-bold'>Earned: </span>{formatCredits(interest)}</p>
      </div>
    </div>
  );
};

export default BalanceSection;
