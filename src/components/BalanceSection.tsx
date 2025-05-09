import React from 'react';
import { balanceIcon, getCreditIcon, stakeApusIcon } from '../assets/stake';

const BalanceSection = () => {
  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] p-6">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
        <h2 className="text-[#262626] text-base">Balance</h2>
        <img src={balanceIcon} alt="Balance" className="w-5 h-5" />
      </div>
      
      <div className="mt-5 space-y-1">
        <p className="text-[#262626] text-sm font-bold">APUS: 100,234.56</p>
        <p className="text-[#262626] text-sm font-bold">Credits: 128</p>
      </div>

      <div className="mt-5 space-y-2.5">
        <button className="w-full flex items-center gap-2 bg-[#3242F5] text-white text-sm px-[15px] py-2 rounded-lg hover:bg-[#2a3ad1] transition-colors">
          <img src={getCreditIcon} alt="Get CREDIT" className="w-4 h-4" />
          <span>Get CREDIT</span>
        </button>
        <button className="w-full flex items-center gap-2 bg-[#3242F5] text-white text-sm px-[15px] py-2 rounded-lg hover:bg-[#2a3ad1] transition-colors">
          <img src={stakeApusIcon} alt="Stake APUS" className="w-4 h-4" />
          <span>Stake APUS</span>
        </button>
        <button className="w-full flex items-center gap-2 bg-[#3242F5] text-white text-sm px-[15px] py-2 rounded-lg hover:bg-[#2a3ad1] transition-colors">
          {/* Transfer credit icon would go here */}
          <span>Transfer CREDIT</span>
        </button>
      </div>
    </div>
  );
};

export default BalanceSection;
