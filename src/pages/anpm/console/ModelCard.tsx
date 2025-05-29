import React from "react";
import { infoIcon, useModelIcon } from "../assets";
import { Pool } from "../contexts/request";
import dayjs from "dayjs";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import { formatNumber, NumberBox } from "../components/NumberBox";

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
  const staking_status = dayjs().isBefore(staking_start_dayjs)
    ? "Upcoming"
    : dayjs().isAfter(staking_end_dayjs)
      ? "Ended"
      : "Ongoing";
  return (
    <div className="flex gap-4 items-center bg-white rounded-lg border border-[#EBEBEB] p-[30px] overflow-hidden">
      <img src={image_url} alt="Model illustration" className="object-cover h-[200px] w-[200px] rounded-lg" />
      <div className="flex-1 flex flex-col gap-[10px]">
        <h2 className="font-bold text-[30px] leading-none">{name}</h2>
        <h3 className="text-sm leading-4">{description}</h3>
        <div>
          {[
            { label: "Staking Start Date", value: staking_start_dayjs.format("YYYY/MM/DD") },
            { label: "Total Staked APUS", value: <NumberBox value={cur_staking} /> },
            {
              label: "APR",
              value: formatNumber(apr, {precision: -2, placeholder: "-", suffix:"%"}),
            },
          ].map(({ label, value }, index) => (
            <div key={index} className="text-sm text-[#909090] leading-tight">
              <span>{label}:</span>
              {typeof value === "string" ? <span className="text-black font-bold">{value}</span> : value}
            </div>
          ))}
        </div>
        <Tooltip
          color="black"
          title={
            <div className="w-[340px] p-5">
              {[
                { label: "Staking Status", value: staking_status },
                { label: "Staking Duration", value: staking_end_dayjs.diff(staking_start_dayjs, "day") + " days" },
                { label: "Staking APR", value: formatNumber(apr, {precision: -2, placeholder: "-", suffix: "%"}) },
                { label: "Min APR", value: formatNumber(min_apr, {precision: -2, placeholder: "-", suffix: "%"}) },
                { label: "APUS Capacity", value: formatNumber(apr, {fixed: 0, placeholder: "-"}) },
                {
                  label: "Staked",
                  value: formatNumber(
                    Number((BigInt(cur_staking) * BigInt(100000)) / BigInt(staking_capacity)) / 100000,
                    {  precision: -2,placeholder: "-", suffix: "%" },
                  ),
                },
              ].map(({ label, value }, index) => (
                <div key={index} className="text-sm leading-none">
                  <span className="inline-block w-[110px] text-[#dadada]">{label}:</span>
                  <span className="inline-block w-[180px] text-white font-bold">{value}</span>
                </div>
              ))}
            </div>
          }
        >
          <img src={infoIcon} className="w-[30px] h-[30px]" />
        </Tooltip>
      </div>
      <Link to="">
        <div className="rounded-lg w-32 h-16 bg-[#3242F5] hover:bg-[#2a3ad1] cursor-pointer flex flex-col items-center justify-center gap-[5px]">
          <img src={useModelIcon} className="w-5 h-5" />{" "}
          <span className="font-bold text-white leading-none">Use Model</span>
        </div>
      </Link>
    </div>
  );
};

export default ModelCard;
