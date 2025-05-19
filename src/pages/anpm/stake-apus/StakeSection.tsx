import { Input, Modal } from 'antd';
import { formatApus, formatCredits } from '../../../utils/utils';
import { stakeApusIcon } from '../assets';
import { BalanceButton } from '../components/BalanceButton';
import { useState } from 'react';
import type { Pool } from '../contexts/balance';

const BalanceSection = ({
  staked,
  interest,
  name,
  apr,
  withdraw,
  withdrawing,
}: Partial<Pool> & {
  staked: string;
  interest: string;
  withdraw: (quantity: string) => Promise<void>;
  withdrawing: boolean;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0');
  const handleInputNumber = (value: string) => {
    if (value === '') {
      setWithdrawAmount('');
    } else if (/^\d*\.?\d*$/.test(value)) {
      if (BigInt(Number(value) * 1e12) > BigInt(staked)) {
        setWithdrawAmount(formatApus(staked));
      } else {
        setWithdrawAmount(value);
      }
    } else {
      setWithdrawAmount(value.slice(0, -1));
    }
  }
  return (
    <div className="box flex flex-col gap-5">
      <div className="space-y-1">
        <p className="text-[#262626] text-sm"><span className='font-bold'>Staked: </span>{formatApus(staked)}</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>Pool: </span>{name}</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>APR: </span>{apr}%</p>
        <p className="text-[#262626] text-sm"><span className='font-bold'>Earned: </span>{formatCredits(interest)}</p>
      </div>

      <div className="flex flex-col gap-[10px]">
        <BalanceButton name="Withdraw APUS" icon={stakeApusIcon} onClick={() => {
          setIsModalVisible(true);
        }} />
      </div>

      <Modal
        title="Withdraw APUS"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onClose={() => setIsModalVisible(false)}
        okButtonProps={{
          loading: withdrawing,
          disabled: withdrawAmount === '' || withdrawAmount === '0',
        }}
        onOk={async () => {
          if (withdrawAmount === '' || withdrawAmount === '0') {
            return;
          }
          await withdraw(BigInt(Number(withdrawAmount) * 1e12).toString());
          setWithdrawAmount('');
          setIsModalVisible(false);
        }}
      >
        {/* how much do you want to withdraw */}
        <div className="flex flex-col gap-2">
          <p className="text-[#262626] text-sm">You can withdraw up to <span className='font-bold'>{formatApus(staked)}</span> APUS</p>
          <Input placeholder="Input the number of APUS you want to withdraw" value={withdrawAmount} onChange={e => {
            const value = e.target.value;
            handleInputNumber(value)
          }} />
          { <p className="text-[#262626] text-sm">You will receive <span className='font-bold'>{withdrawAmount}</span> APUS</p>}
        </div>
      </Modal>
    </div>
  );
};

export default BalanceSection;
