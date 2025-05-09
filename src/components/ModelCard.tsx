import React from 'react';
import { modelCardBg, modelIcon, infoIcon } from '../assets/stake';

interface ModelCardProps {
  modelName: string;
  description: string;
  poolCredit: number;
  totalStaked: number;
  apr: number;
}

const ModelCard: React.FC<ModelCardProps> = ({
  modelName,
  description,
  poolCredit,
  totalStaked,
  apr
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] overflow-hidden">
      <div className="relative h-[160px]">
        <img 
          src={modelCardBg} 
          alt="Model background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 p-6 flex items-end">
          <div className="flex items-center gap-3">
            <img src={modelIcon} alt="Model" className="w-6 h-6" />
            <h3 className="text-white text-base font-semibold">{modelName}</h3>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[#6B7280] text-sm mb-6">{description}</p>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-[#6B7280] text-sm">Pool Credit</span>
            <span className="text-[#262626] text-sm font-semibold">{poolCredit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280] text-sm">Total Staked</span>
            <span className="text-[#262626] text-sm font-semibold">${totalStaked.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280] text-sm">APR</span>
            <span className="text-[#262626] text-sm font-semibold">{apr}%</span>
          </div>
        </div>

        <button className="w-full mt-6 flex items-center justify-center gap-3 bg-[#3242F5] text-white text-sm px-6 py-3 rounded-lg hover:bg-[#2a3ad1] transition-colors">
          <img src={infoIcon} alt="Info" className="w-5 h-5" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

export default ModelCard;
