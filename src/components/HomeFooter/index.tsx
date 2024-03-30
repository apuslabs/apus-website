import { FC } from "react";
import "./index.less";
import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";

interface HomeFooterProps {
  showCompany?: boolean;
}

const HomeFooter: FC<HomeFooterProps> = (props) => {
  const { showCompany } = props;

  return (
    <div className="home-footer">
      {showCompany && (
        <div className="footer-company">
          <div className="footer-company-title">
            Trusted by 1600+ of the world most popular companies
          </div>
          <ul className="footer-company-list">
            <li>
              <img src="/src/assets/novita.png" />
            </li>
            <li>
              <img src="/src/assets/dephy.png" />
            </li>
            <li>
              <img src="/src/assets/lagrange.png" />
            </li>
            <li>
              <img src="/src/assets/punet.png" />
            </li>
            <li>
              <img src="/src/assets/omnilnfer.png" />
            </li>
          </ul>
        </div>
      )}

      <div className="footer-build">
        <div className="footer-build-title">Let’s build future<br/>together</div>
        <Button type="primary" className="start-btn">
          Start Now <RightOutlined />
        </Button>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-text">
          Join the community and get involved! We'd love to meet you.
        </div>
        <div></div>
        <div className="footer-bottom-access">
          Revolutionizing AI with fair, scalable, decentralized access.
        </div>
      </div>

      <div className="footer-copyright">
        <div>Copyright © Apus.Network 2024. All rights reserved</div>
      </div>
    </div>
  );
};

HomeFooter.defaultProps = {
  showCompany: true,
};

export default HomeFooter;