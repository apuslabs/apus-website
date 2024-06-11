import { FC, useEffect, useLayoutEffect } from "react";
import "./index.less";
import { solApiFetcher, useStatistics } from "../../contexts/task";
import { useLocation, Link } from "react-router-dom";
import QueryString from "qs";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ImgHomepage } from "../../assets/image";
import { useBreakpoint } from "../../utils/react-use";
// @ts-ignore
import fullpage from "fullpage.js";
import { AIAssistantBlobAnimation } from "./AIAssistantBlobAnimation";
import { DocLink } from "../../config/menu";

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
} else {
  window.onbeforeunload = function () {
      window.scrollTo(0, 0);
  }
}

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

  useEffect(() => {
    const fullpageInstance = new fullpage("#fullpage", {
      licenseKey: "gplv3-license",
      hybrid: true,
      fitToSection: false,
      normalScrollElements: isMobile ? '#solution-img' : '',
      lockAnchors: true,
      anchors: [],
    });
  }, [isMobile]);

  useLayoutEffect(() => {
    var observer = new IntersectionObserver(function(entries) {
      if(entries[0].isIntersecting === true) {
          // 依次显示卡片
          const cards = document.querySelectorAll('.benifits-item');
          cards.forEach((card, index) => {
              setTimeout(() => {
                  card.classList.add('active');
              }, 300 * index); // 每个卡片的动画间隔300ms
          });
      }
    }, { threshold: [0.5] });

    observer.observe(document.querySelector("#benifits")!);

    return () => {
      observer.disconnect();
    }
  }, [])

  return (
    <div id="fullpage">
      {/* Hero */}
      <div className="section relative flex flex-col justify-center items-center" style={{
        paddingBottom: '20vh'
      }}>
        <AIAssistantBlobAnimation />
        <div className="text-white text-center mb-24 text-medium text-2xl md:text-[4rem] leading-tight">
          Trustless <br /> GPU Network for <br />{" "}
          <span className="text-[#01BFCF]">AI on AO</span>
        </div>
        {/* <div className="flex justify-center gap-6">
          <Link to="/app/workers/new">
            <div className="btn-main btn-colorful">Provide Your GPU</div>
          </Link>
          <Link to="/app/aiAgents">
            <div className="btn-main">Publish Your Agents</div>
          </Link>
        </div> */}
      </div>
      {/* Benifits */}
      <div className="section pt-small flex flex-col items-center justify-center">
        <div className="section-header text-center">Features</div>
        <div className="section-description mb-6 md:mb-[10rem] text-center">Leading platform of AI Agents</div>
        <div id="benifits" className="grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 gap-5 md:gap-10 w-full">
          {[
            {
              title: "GPU Integrity",
              describe:
                "Ensuring the integrity and proper functioning of GPUs in the network.",
              icon: ImgHomepage.IconFeaturesGPUIntegrity,
            },
            {
              title: `AI Model ${!isMobile ? '\n' : ''}Trustworthiness`,
              describe:
                "Guaranteeing the trustworthiness and integrity of AI models within the network.",
              icon: ImgHomepage.IconFeaturesAIModel,
            },
            {
              title: `Verifiable inference ${!isMobile ? '\n' : ''}Results`,
              describe:
                "Verifying the integrity and accuracy of AI model inference results on the network.",
              icon: ImgHomepage.IconFeaturesVerifiableResult,
            },
          ].map(({ title, describe, icon }) => (
            <div
              key={title}
              className="relative md:h-[22.25rem] p-5 md:p-10 border border-solid flex flex-col rounded-2xl benifits-item"
              style={{
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <img
                src={icon}
                className="w-16 h-16 mb-6 md:mb-10"
              />
              <div className="flex-1 text-2xl md:text-3xl md:text-[2rem] text-wrap whitespace-pre-wrap">
                {title}
              </div>
              <div className="text-xs md:text-base opacity-50">{describe}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Solution */}
      <div className="section relative">
        <div className="-z-10 absolute w-full h-full left-0 top-0" style={{
          // inner shadow x:0 y:0 blur:64 color:rgba(255,255,255,0.1)
          boxShadow: 'inset 0 0 64px rgba(255,255,255,0.1)',
        }}></div>
        <div className="-z-10 absolute w-[124vw] h-[180vh] -bottom-[30vh] -left-[12vw] border-[32px] border-solid border-white blur-[100px] rounded-[50%]"></div>
        <div className="-z-10 absolute w-[124vw] h-[180vh] -bottom-[14vh] -left-[12vw] border-[32px] border-solid border-[#6601AA] blur-[100px] rounded-[50%]"></div>
        <div className="-z-10 absolute w-[124vw] h-[180vh] bottom-0 -left-[12vw] border-[32px] border-solid border-[#2715F1] blur-[100px] rounded-[50%]"></div>
        <div className="section-header md:mt-24">Solution</div>
        <div className="section-description">DePIN for AI inference</div>
        {!isMobile && <button className="btn-main btn-colorful mt-16 z-10" onClick={() => {
          window.open(DocLink, '_blank')
        }}>Doc</button>}
        <div id="solution-img" className="w-screen md:w-full md:h-full overflow-x-auto -mx-5 md:mx-0 mt-16 md:mt-0 relative md:absolute md:top-0 md:left-0 md:bottom-0">
          <img
            className="md:absolute md:left-1/2 md:top-2/3 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[67.5rem] h-150 md:h-[34.75rem] overflow-x-scroll max-w-none px-5 md:px-0"
            src={ImgHomepage.BgSolution}
          />
        </div>
      </div>

      {/* HighLights */}
      <div className="section relative fp-noscroll">
        <div className="-z-10 absolute w-full h-full top-0 left-0" style={{
          backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 20%, rgba(102,1,170,0%) 20%, rgba(26,15,118,80%) 90%, #160C87 140%)',
        }}></div>
        <img className="-z-10 absolute right-0 bottom-0 w-full md:w-[82.5rem] h-72 md:h-[32rem]" src={!isMobile ? ImgHomepage.BgHighlights : ImgHomepage.BgHighlightsMobile}/>
        <div className="section-header text-center md:text-left">High Lights</div>
        <div className="section-description text-center md:text-left">The status of Apus Network</div>
        <div className="w-full mt-32 px-5 md:px-0 grid grid-rows-2 grid-cols-2 gap-16 md:flex md:gap-56 md:mt-16">
          {[
            {
              title: "GPUs",
              value: gpuCount,
            },
            {
              title: "AI Agents",
              value: agentCount,
            },
            {
              title: "AI Tasks",
              value: taskCount,
            },
            {
              title: "Network Payout",
              value: payoutCount,
            },
          ].map(({ title, value }) => (
            <div
              key={title}
            >
              <div className="text-sm md:text-xl opacity-50 leading-none text-nowrap">
                {title}
              </div>
              <div
                className="text-5xl md:text-6xl mt-5 md:mt-6 text-transparent leading-none text-nowrap bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.3) 100%)",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted By */}
      <div className="section relative flex flex-col md:justify-center items-center">
        <div className="section-header text-center">Powered By</div>
        {/* <div className="section-description text-center">
          The following companies are in partnership with us
        </div> */}
        <div className="mt-16 grid grid-cols-2 grid-flow-row gap-3 md:flex md:gap-6 md:items-center md:justify-center md:flex-wrap">
          {[
            { img: ImgHomepage.LogoAO, height: "1.625rem" },
            { img: ImgHomepage.LogoArweave, height: "1.875rem" },
            { img: ImgHomepage.LogoSolana, height: "1.125rem" },
            { img: ImgHomepage.LogoDephy, height: "2.25rem" },
          ].map(({ img, height }, i) => (
            <div
              key={i}
              className="h-20 md:w-52 md:h-24 flex items-center justify-center rounded-lg"
              style={{
                backgroundColor: "#1e1e1e",
              }}
            >
              <img src={img} className="h-7" style={{ height }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeIndex;
