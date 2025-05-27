import { Input, Slider } from "antd";
import { useEffect, useState } from "react";

export function BalanceSldier({
  label,
  max,
  value,
  onChange,
  className,
}: {
  label?: string;
  max: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const [valueStr, setValueStr] = useState(value.toString());
  useEffect(() => {
    setValueStr(value.toString());
  }, [value]);
  return (
    <div className={`w-full flex flex-col items-end ${className}`}>
      <Slider className="w-full" min={0} max={max} tooltip={{ open: true }} value={value} onChange={onChange} />
      <Input
        className="w-[240px] -mt-[15px]"
        suffix={
          <div className="flex text-[#121212] font-bold">
            {label}
            <span
              className="cursor-pointer text-[#3242F5] ml-1 z-30"
              onClick={() => {
                onChange(max);
              }}
            >
              MAX
            </span>
          </div>
        }
        value={valueStr}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "") {
            setValueStr("");
            onChange(0);
            return;
          }
          // test if the value is a number or a dot
          if (!/^\d*\.?\d*$/.test(value)) {
            setValueStr(value.slice(0, -1));
          }
          if (value === "" || Number(value) <= max) {
            setValueStr(value);
            if (value === Number(value).toString()) {
              onChange(Number(value));
            }
          } else {
            setValueStr(max.toString());
            onChange(max);
          }
        }}
      />
    </div>
  );
}
