import React from 'react';
import { Link } from 'react-router-dom';

export const BalanceButton = ({ name, icon, to }: {
  name: string;
  icon: string;
  to: string;
}) => {
  return <Link to={to}>
    <button className="w-full flex items-center gap-2 bg-[#3242F5] text-white text-sm px-[15px] py-2 rounded-lg hover:bg-[#2a3ad1] transition-colors">
      <img src={icon} alt={name} className="w-4 h-4" />
      <span>{name}</span>
    </button>
  </Link>;
};
