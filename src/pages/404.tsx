import { Result } from "antd";
import HomeHeader from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white relative z-10">
      <HomeHeader></HomeHeader>
      <Result
        className="flex-1 p-4 pt-24"
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link className="flex justify-center" to="/">
            <div className="btn-main btn-colorful">Back Home</div>
          </Link>
        }
      />
      <HomeFooter></HomeFooter>
    </div>
  );
}
