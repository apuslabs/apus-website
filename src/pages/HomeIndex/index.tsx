import { FC, useLayoutEffect } from "react";
import HomeFooter from "../../components/HomeFooter";
import "./index.less";
import { solApiFetcher, useStatistics } from "../../contexts/task";
import { useLocation, Link } from "react-router-dom";
import QueryString from "qs";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ImgHomepage } from "../../assets/image";
import { useBreakpoint } from "../../utils/react-use";

const CompanyInfo: FC<{
  img: string;
  desc: string;
}> = ({ img, desc }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex justify-center items-center border border-solid rounded-full h-80 w-80"
        style={{
          borderColor: "rgba(255, 255, 255, 0.2)",
          background:
            "linear-gradient(-60deg, #160C87 0%, rgba(102,1,170,0) 100%)",
        }}
      >
        <img src={img} className="h-10" />
      </div>
      <div className="mt-12 text-xl">{desc}</div>
    </div>
  );
};

const HomeIndex: FC = () => {
  const { gpuCount, taskCount, agentCount, payoutCount } = useStatistics();

  const location = useLocation();

  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  useLayoutEffect(() => {
    const t = setTimeout(() => {
      const query = QueryString.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      if ("referral_code" in query) {
        if (!connected) {
          setVisible(true);
        } else {
          solApiFetcher.post("/invite-by", {
            solanaAddress: publicKey?.toBase58(),
            invitedBy: query.referral_code,
          });
        }
      }
    }, 1000);
    return () => {
      clearTimeout(t);
    };
  }, [location.search, connected, publicKey]);

  return (
    <div className="home-index">
      {/* Hero */}
      <div
        className=" relative flex flex-col justify-center items-center z-1"
        style={{
          height: "67.5rem",
        }}
      >
        <img
          className="absolute top-0 h-full -z-10 blur-lg object-cover"
          src={ImgHomepage.BgHero}
        />
        <img
          className="absolute top-0 -z-10"
          style={{
            top: "13rem",
            left: "50%",
            transform: "translateX(-50%)",
            height: "16rem",
            width: "23rem",
          }}
          src={ImgHomepage.IconHeroLogo}
        />
        <div
          className="text-white mb-12 text-medium text-4xl md:text-8xl"
        >
          DePIN + AI Agents
        </div>
        <div
          className="text-base md:text-xl opacity-50 text-center"
          style={{
            marginBottom: "8rem",
          }}
        >
          Empower a decentralized AI agents ecosystem <br />
          and boost AI democratization!
        </div>
        <div className="flex gap-6">
          <Link to="/app/workers/new">
            <div className="btn-main btn-colorful">Provide Your GPU</div>
          </Link>
          <Link to="/app/aiAgents">
            <div className="btn-main">Publish Your Agents</div>
          </Link>
        </div>
      </div>

      {/* HighLights */}
      <div className="section">
        <div className="section-header">Highlights</div>
        <div className="section-description">The status of Apus Network</div>
        <div className="w-full grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 gap-5 md:gap-12 highlights">
          {[
            {
              img: ImgHomepage.IconHighlightsGPU,
              title: "GPUs",
              value: gpuCount,
            },
            {
              img: ImgHomepage.IconHighlightsAgent,
              title: "AI Agents",
              value: agentCount,
            },
            {
              img: ImgHomepage.IconHighlightsTask,
              title: "AI Tasks",
              value: taskCount,
            },
            {
              img: ImgHomepage.IconHighlightsPayout,
              title: "Network Payout",
              value: payoutCount,
            },
          ].map(({ img, title, value }) => (
            <div
              key={title}
              className="relative bg-black rounded-2xl h-44 md:h-72 px-5 py-5 md:px-10 md:py-6 flex flex-col justify-end items-end highlights-item"
            >
              <img
                src={img}
                className="absolute w-24 h-24 md:w-36 md:h-36 left-6 top-3 md:left-10 md:top-6 transition-transform highlights-item-icon"
              />
              <div className="text-sm md:text-xl opacity-50 leading-none">{title}</div>
              <div
                className="text-5xl md:text-6xl mt-5 md:mt-6 text-transparent leading-none"
                style={{
                  background:
                    "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.3) 100%)",
                    backgroundClip: "text",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mechanism */}
      <div className="section">
        <div className="section-header">Mechanism</div>
        <div className="section-description">DePIN for AI agents</div>
        <div className="w-full overflow-x-scroll">
          <img className="h-150 md:h-auto overflow-x-scroll max-w-none md:w-full" src={ImgHomepage.ImgMechanism} />
        </div>
      </div>

      {/* Benifits */}
      <div className="section">
        <div className="section-header">Benifits</div>
        <div className="section-description">Leading platform of AI Agents</div>
        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 gap-5 md:gap-12 w-full">
          {[
            {
              title: "Affordability",
              describe:
                "Cost-effective AI, making cutting-edge technology accessible.",
              icon: ImgHomepage.IconBenifitsAffordability,
            },
            {
              title: "Transparent\nTransactions",
              describe:
                "Clear, honest engagements ensuring transaction integrity.",
              icon: ImgHomepage.IconBenifitsBenifitsTransparent,
            },
            {
              title: "Ownership\nProtection",
              describe:
                "Safeguarding intellectual contributions with robust protections.",
              icon: ImgHomepage.IconBenifitsBenifitsOwnership,
            },
            {
              title: "Global Compute\nMarketplace",
              describe: "Connecting global Compute resources for fair access.",
              icon: ImgHomepage.IconBenifitsBenifitsGlobal,
            },
          ].map(({ title, describe, icon }) => (
            <div
              key={title}
              className="relative h-44 md:h-72 p-6 md:p-10 border border-solid flex flex-col justify-between benifits-item rounded-2xl"
              style={{
                borderColor: "rgba(255, 255, 255, 0.2)",
                backgroundColor: "#0B0B0B",
              }}
            >
              <img
                src={icon}
                className="absolute w-8 h-8 md:w-12 md:h-12 right-6 top-6 md:right-10 md:top-10 benifits-item-icon"
              />
              <div className=" text-3xl md:text-5xl pr-22 text-wrap whitespace-pre-wrap">{title}</div>
              <div className="text-sm opacity-50">{describe}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div className="section">
        <div className="section-header">Why Us</div>
        <div className="section-description">
          Abundant computing power and large user scale
        </div>
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-7">
          <CompanyInfo img={ImgHomepage.LogoWhyusPPTV} desc="4500M+ Users" />
          <img src={ImgHomepage.IconArrowRight} className={`${isMobile ? "rotate-90 h-16 w-16" : "pb-16"}`} />
          <CompanyInfo img={ImgHomepage.LogoWhyusPPIO} desc="5000+ Nodes" />
          <img src={ImgHomepage.IconArrowRight} className={`${isMobile ? "rotate-90 h-16 w-16" : "pb-16"}`} />
          <CompanyInfo
            img={ImgHomepage.LogoWhyusApus}
            desc="Unlimited Compute"
          />
        </div>
      </div>

      {/* Trusted By */}
      <div className="section">
        <div className="section-header">Trusted By</div>
        <div className="section-description">
          The following companies are in partnership with us
        </div>
        <div className="flex flex-col gap-12 md:gap-24">
          {[
            {
              group: "Customers",
              list: [
                { img: ImgHomepage.LogoTaiko, height: "1.75rem" },
                { img: ImgHomepage.LogoScroll, height: "1.875rem" },
                { img: ImgHomepage.LogoAbyssWorld, height: "4.125rem" },
                { img: ImgHomepage.LogoNovita, height: "1.625rem" },
              ],
            },
            {
              group: "Middlewares",
              list: [
                { img: ImgHomepage.LogoDephy, height: "2.25rem" },
                { img: ImgHomepage.LogoW3bstream, height: "2.5rem"},
                { img: ImgHomepage.LogoSolana, height: "1.125rem" },
                { img: ImgHomepage.LogoArweave, height:  "1.875rem" },
                { img: ImgHomepage.LogoEigenlayer, height: "2.5rem" },
              ],
            },
            {
              group: "Suppliers",
              list: [
                { img: ImgHomepage.LogoPPIO, height: "2rem"},
                { img: ImgHomepage.LogoLagrange, height: "2.25rem"},
                { img: ImgHomepage.LogoGpunet, height: "1.75rem" },
                { img: ImgHomepage.LogoZkpool, height: "1.875rem"},
              ],
            },
          ].map(({ group, list }) => (
            <div className="flex flex-col items-center" key={group}>
              <div className="mb-6 md:mb-10 text-xl">{group}</div>
              <div className="flex gap-3 md:gap-6 items-center justify-center flex-wrap">
                {list.map(({img, height}, i) => (
                  <div
                    key={i}
                    className="w-40 h-20 md:w-52 md:h-24 flex items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: "#1e1e1e",
                    }}
                  >
                    <img
                      src={img}
                      className="h-7"
                      style={{height}}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slogan */}
      <div className="section">
        <div className="w-full relative flex items-center justify-center h-48 md:h-150">
          <img src={ImgHomepage.BgSlogan} className=" absolute top-0 bottom-0 left-0 right-0 w-full -z-10" />
          <div className=" text-2xl md:text-6xl text-white text-center leading-tight">Let's Build Future <br/> Together</div>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default HomeIndex;
