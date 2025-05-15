import React from 'react';
import { infoIcon, useModelIcon } from '../assets';
import type { Pool } from '../contexts/balance';
import { formatApus } from '../../../utils/utils';

export type ModelCardProps = Pool & {
  onUseModel: () => void;
  credits: string;
}

const ModelCard: React.FC<ModelCardProps> = ({
  name,
  description,
  credits,
  cur_staking,
  image_url,
  apr,
  onUseModel,
}) => {
  return (
    <div className="flex gap-4 items-center bg-white rounded-lg border border-[#EBEBEB] p-[30px] overflow-hidden">
      <img 
        src={image_url}
        alt="Model illustration"
        className="object-cover h-[200px] w-[200px] rounded-lg"
      />
      <div className='flex-1 flex flex-col gap-[10px]'>
        <div className='flex gap-[10px] items-center'>
          <img 
            src={infoIcon} 
            alt="Model icon" 
            className="w-[30px] h-[30px]" 
          />
          <p className="text-sm text-[#909090]">Pool Credit: <span className="text-black font-bold">{formatApus(credits)}</span></p>
        </div>
        <h2 className="font-bold text-[30px] leading-none">{name}</h2>
        <h3 className="text-sm leading-4">{description}</h3>
        <p className='text-sm text-[#909090]'>Total Staked APUS: <span className="text-black font-bold">{formatApus(cur_staking)}</span>
        <br/>APR: <span className="text-black font-bold">{apr}%</span></p>
      </div>
      <div className="rounded-lg w-32 h-16 bg-[#3242F5] hover:bg-[#2a3ad1] cursor-pointer flex flex-col items-center justify-center gap-[5px]" onClick={onUseModel}><img src={useModelIcon} className="w-5 h-5" /> <span className='font-bold text-white leading-none'>Use Model</span></div>
    </div>
  );
};

export default ModelCard;
