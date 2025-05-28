import React from 'react';
import { infoIcon, useModelIcon } from '../assets';
import { formatApus } from '../../../utils/utils';
import { Pool } from '../contexts/request';
import dayjs from 'dayjs';
import { Tooltip } from 'antd';

const ModelCard: React.FC<Pool> = ({
  name,
  description,
  cur_staking,
  staking_start,
  staking_end,
  image_url,
  apr,
  min_apr,
  staking_capacity,
}) => {
  const staking_start_dayjs = dayjs(Number(staking_start));
  const staking_end_dayjs = dayjs(Number(staking_end));
  const staking_status = dayjs().isBefore(staking_start_dayjs) ? 'Upcoming' : dayjs().isAfter(staking_end_dayjs) ? 'Ended' : 'Ongoing';
  return (
    <div className="flex gap-4 items-center bg-white rounded-lg border border-[#EBEBEB] p-[30px] overflow-hidden">
      <img 
        src={image_url}
        alt="Model illustration"
        className="object-cover h-[200px] w-[200px] rounded-lg"
      />
      <div className='flex-1 flex flex-col gap-[10px]'>
        {/* <div className='flex gap-[10px] items-center'>
          <img 
            src={infoIcon} 
            alt="Model icon" 
            className="w-[30px] h-[30px]" 
          />
          <p className="text-sm text-[#909090]">Pool Credit: <span className="text-black font-bold">{formatApus(credits)}</span></p>
        </div> */}
        <h2 className="font-bold text-[30px] leading-none">{name}</h2>
        <h3 className="text-sm leading-4">{description}</h3>
        <div>
        {[
          { label: 'Staking Start Date', value: staking_start_dayjs.format("YYYY/MM/DD") },
          { label: 'Total Staked APUS', value: formatApus(cur_staking) },
          { label: 'APR', value: `${apr || '-'}%` },
        ].map((item, index) => (
          <div key={index} className='text-sm text-[#909090] leading-tight'>
            <span>{item.label}:</span>
            <span className='text-black font-bold'>{item.value}</span>
          </div>
        ))}
        </div>
        <Tooltip color="black" title={<div className='w-[340px] p-5'>
          {
            [
              { label: 'Staking Status', value: staking_status },
              { label: 'Staking Duration', value: staking_end_dayjs.diff(staking_start_dayjs, 'day') + ' days' },
              { label: 'Staking APR', value: apr ? `${apr}%` : '-' },
              { label: 'Min APR', value: min_apr ? `${Number(min_apr) *100}%` : '-' },
              { label: 'APUS Capacity', value: staking_capacity ? formatApus(staking_capacity) : '-' },
              { label: 'Staked', value: Number(BigInt(cur_staking) * BigInt(100000) / BigInt(staking_capacity)) / 100000 + '%' }
            ].map((item, index) => (
              <div key={index} className='text-sm leading-none'>
                <span className='inline-block w-[110px] text-[#dadada]'>{item.label}:</span>
                <span className='inline-block w-[180px] text-white font-bold'>{item.value}</span>
              </div>
            ))
          }
        </div>}>
          <img src={infoIcon} className='w-[30px] h-[30px]' />
        </Tooltip>
      </div>
      <div className="rounded-lg w-32 h-16 bg-[#3242F5] hover:bg-[#2a3ad1] cursor-pointer flex flex-col items-center justify-center gap-[5px]"><img src={useModelIcon} className="w-5 h-5" /> <span className='font-bold text-white leading-none'>Use Model</span></div>
    </div>
  );
};

export default ModelCard;
