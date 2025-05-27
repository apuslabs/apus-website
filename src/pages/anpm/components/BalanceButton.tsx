import React from 'react';
import { Link } from 'react-router-dom';

export const BalanceButton = ({ name, icon, to, active, size, className, onClick }: {
  name: string;
  icon?: string;
  size?: "small" | "medium" | "large";
  to?: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  const Button = <button className={`flex items-center gap-2  text-white text-sm py-2 rounded-lg transition-colors ${size === "small" ? 'px-[8px]' : 'px-[15px]'} ${active ? "bg-[#6f6f6f]" : "bg-[#3242F5] hover:bg-[#2a3ad1]"} ${className}`} onClick={onClick}>
      {icon ? <img src={icon} alt={name} className="w-4 h-4" /> : null}
      <span>{name}</span>
    </button>
  return to ? <Link to={to}>{Button}</Link> : Button;
};
