import { FC } from "react";
import "./index.less";
import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Dephy, Lagrange, Novita, Omnilnfer, Punet } from "../../assets/image";

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
              <img src={Novita} />
            </li>
            <li>
              <img src={Dephy} />
            </li>
            <li>
              <img src={Lagrange} />
            </li>
            <li>
              <img src={Punet} />
            </li>
            <li>
              <img src={Omnilnfer} />
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
        <div className="footer-bottom-img">
          <img src="/src/assets/footer-icon.png" />
        </div>
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
