import { NumberBox } from '../components/NumberBox';
import { Pool } from '../contexts/request';

const BalanceSection = ({
  staked,
  interest,
  name,
  apr,
  loading,
}: Partial<Pool> & {
  staked: string;
  interest: string;
  loading?: boolean;
}) => {
  return (
    <div className="w-full bg-[#121212] p-6 mb-10 flex flex-col gap-1 rounded-lg">
      <div className="space-y-1 text-sm text-white">
        <p><span className='font-bold'>Staked: </span><NumberBox
                  value={staked}
                  fixed={6}
                  loading={loading}
                /></p>
        <p><span className='font-bold'>Pool: </span>{name}</p>
        <p><span className='font-bold'>APR: </span><NumberBox value={apr} precision={-2} loading={loading} suffix='%' /></p>
        <p><span className='font-bold'>Earned: </span><NumberBox value={interest} fixed={6} loading={loading} /></p>
      </div>
    </div>
  );
};

export default BalanceSection;
