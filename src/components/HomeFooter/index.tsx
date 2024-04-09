import { FC } from "react";
import "./index.less";
import { Button } from "antd";
import { RightOutlined, TwitterOutlined } from "@ant-design/icons";
import { AbyssWorldLogo, ArweaveLogo, Dephy, FooterIcon, Lagrange, Novita, Omnilnfer, PPIOLogo, Punet, SolanaLogo, TelegramIcon, TwitterIcon } from "../../assets/image";
import { useNavigate } from "react-router-dom";
// import TelegramIcon from "../../assets/telegram-fill.svg";
// import TwitterIcon from "../../assets/twitter.svg";

interface HomeFooterProps {
  showCompany?: boolean;
}

const HomeFooter: FC<HomeFooterProps> = (props) => {
  const { showCompany } = props;
  const navigate = useNavigate()

  return (
    <div className="home-footer">
      {showCompany && (
        <div className="footer-company">
          <div className="footer-company-title">
            Trusted by following companies
          </div>
          <ul className="footer-company-list">
            <li>
              <img src={Novita} />
            </li>
            <li>
              <img src={Dephy} />
            </li>
            <li>
              <img src={PPIOLogo} />
            </li>
            <li>
              <img src={Lagrange} />
            </li>
            <li>
              <img src={SolanaLogo} />
            </li>
            <li>
              <img src={ArweaveLogo} />
            </li>
            {/* <li>
              <img src={AbyssWorldLogo} />
            </li> */}
          </ul>
        </div>
      )}

      <div className="footer-build">
        <div className="footer-build-title">Let’s build future<br/>together</div>
        {/* <Button type="primary" className="start-btn" onClick={() => {
          navigate('/app/workers')
        }}>
          Start Now <RightOutlined />
        </Button> */}
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-text">
          Join the community and get involved! We'd love to meet you.
        </div>
        <div className="footer-bottom-link">
          <ul className="footer-bottom-link-list">
            <li><a href="https://twitter.com/apus_network"><img src={TwitterIcon} /></a></li>
            <li><a href="https://t.me/+AWdHtLSl2m4yM2I1"><img src={TelegramIcon} /></a></li>
          </ul>
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
