import { useState } from "react";
import BalanceSection from "../components/BalanceSection";
import { Breadcrumb, Slider } from "antd";

export function Component() {
const [percent, setPercent] = useState(0);
const onPercentChange = (value: number) => {
    setPercent(value)
}
  return (
    <main className="pt-[170px] pb-[90px] bg-[#F9FAFB]">
      <div className="content-area mb-[60px]">
        <Breadcrumb
          items={[
            {
              title: 'Dashboard',
              path: '/anpm/console',
            },
            {
              title: 'Buy CREDIT',
            },
          ]}
        />
      </div>
      <div className="max-w-[1200px] mx-auto flex gap-10">
        <div className="w-[250px]">
          <BalanceSection />
        </div>
        <div className="box w-[640px] flex flex-col items-center gap-[10px]">
            <div className="box w-[280px] text-center text-[#262626] text-base">
                <div className="mb-[15px]">1 CREDIT = <span className="font-bold">$0.01</span> (Fxied)</div>
                <div className="text-sm text-center">
                    Current Exchange Rate:<br />
                    1 CREDIT = <span className="font-bold">12345 APUS</span> (Dynamic)
                </div>
            </div>
            <Slider
                className="w-full"
                marks={{ 0: <span className="font-bold">0%</span>, 100: <div className="font-bold">MAX</div> }}
                min={0}
                max={100}
                step={1}
                value={percent}
                onChange={v => onPercentChange(v)}
              />
              <div className="btn-mainblue font-semibold w-36 h-12">Buy CREDIT</div>
        </div>
      </div>
    </main>
  );
}