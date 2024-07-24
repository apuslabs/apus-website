import { Outlet } from "react-router-dom";
import ConsoleHeader from "../../components/ConsoleHeader";
import { ConfigProvider } from "antd";

export default function() {
  return <div className="bg-[#D7DDF4] min-h-screen pt-20">
    <ConsoleHeader />
    <Outlet />
  </div>
}