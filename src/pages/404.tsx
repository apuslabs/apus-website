import { Result } from "antd";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
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
  );
}
