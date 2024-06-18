import { FC, useEffect, useLayoutEffect, useState } from "react";
import "./index.less";
// import { solApiFetcher, useStatistics } from "../../contexts/task";
import { Link } from "react-router-dom";
// import QueryString from "qs";
import { ImgHomepage } from "../../assets/image";
import { useBreakpoint } from "../../utils/react-use";
// @ts-ignore
import fullpage from "fullpage.js";
import { FooterSocialMediaList } from "../../config/menu";
// import { AIAssistantBlobAnimation } from "./AIAssistantBlobAnimation";
// import { DocLink } from "../../config/menu";

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
} else {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}

const HomeIndex: FC = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "auto";
    } else {
      const fullpageInstance = new fullpage("#fullpage", {
        licenseKey: "gplv3-license",
        hybrid: true,
        fitToSection: false,
        normalScrollElements: isMobile ? "#solution-img" : "",
        lockAnchors: true,
        anchors: [],
      });
    }
  }, [isMobile]);

  useLayoutEffect(() => {
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting === true) {
          // 依次显示卡片
          const cards = document.querySelectorAll(".benifits-item");
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("active");
            }, 300 * index); // 每个卡片的动画间隔300ms
          });
        }
      },
      { threshold: [0.5] }
    );

    observer.observe(document.querySelector("#benifits")!);

    return () => {
      observer.disconnect();
    };
  }, []);

  const [announcementShow, setAnnouncementShow] = useState<boolean>(true);

  return (
    <div id="fullpage">
      {/* Hero */}
      <div
        className="section min-h-screen md:min-h-none relative flex flex-col justify-center items-center"
        style={{
          paddingBottom: "20vh",
          backgroundImage: `url(${ImgHomepage.BgHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-white text-center w-2/3 mx-auto -mt-56 mb-24 text-medium text-4xl md:text-[4rem] leading-tight">
          Trustless GPU Network for AI on AO
        </div>

        {announcementShow ? <div className="boreder-benifits absolute bottom-3 md:bottom-auto md:top-20 left-1/2 -translate-x-1/2 p-6 flex items-center z-50" style={{
          width: isMobile ? 'calc(100% - 1.5rem)' : '60rem'
        }}>
          <img src={ImgHomepage.IconAnnouncement} className="w-5 h-5 mr-4" />
          <div className="text-xs md:text-sm text-white flex-1 mr-6">Apus has removed Ecosystem, Playground, Task and Connect Wallet. In the meantime your points have been retained, and a new incentive mechanism will be added in the future. Stay tuned!</div>
          <div className="btn-main btn-small btn-colorful" onClick={() => { setAnnouncementShow(false) }}>Got It</div>
        </div> : null}

      </div>
      {/* Benifits */}
      <div className="section flex flex-col items-center justify-center">
        <div className="section-header text-center mb-6 md:mb-[3rem]">
          Key Features
        </div>
        <div className="section-description mb-6 md:mb-[6rem] w-[18.75rem] md:w-1/2 md:mx-auto text-center">
          Apus Network is building towards a decentralized, trustless GPU
          network dedicated to providing reliable, efficient, and low-cost
          computational power for AI training and inference.
        </div>
        <div
          id="benifits"
          className="grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 gap-5 md:gap-10 w-full"
        >
          {[
            {
              title: `Competitive Incentive<br/>For AI Models`,
              describe:
                "Apus Network's economic model competitively incentivizes the development and execution of the best AI models.",
              img: ImgHomepage.FeaturesIncentive,
            },
            {
              title: `Deterministic Execution<br/>for GPUs`,
              describe:
                "Apus Network provides an open-source AO extension of deterministic GPU. This ensures trustless execution for AI.",
              img: ImgHomepage.FeaturesExecution,
              imgClassName: "-ml-4 md:-ml-10",
            },
            {
              title: `Cost-Effective AI<br/>Training and Inference`,
              describe:
                "Apus Network utilizes GPU mining nodes to perform optimal, trustless model training and inference on Arweave.",
              img: ImgHomepage.FeaturesCost,
            },
          ].map(({ title, describe, img, imgClassName }) => (
            <div
              key={title}
              className="relative p-10 border border-solid flex flex-col rounded-2xl benifits-item overflow-hidden"
              style={{
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                className="flex-1 text-2xl mb-8 md:mb-10 md:text-2xl xl:text-3xl text-nowrap"
                dangerouslySetInnerHTML={{ __html: title }}
              ></div>
              <div className="text-xs mb-8 md:mb-9 md:text-base opacity-50">
                {describe}
              </div>
              <img src={img} className={`opacity-0 ${imgClassName ?? ""}`} />
              <img
                src={img}
                className={`absolute bottom-0 ${imgClassName ?? ""}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Solution */}
      <div className="section relative flex flex-col items-center pt-none">
        <div className="section-header mt-12 md:mt-20">How it works</div>
        <div className="section-description w-[18.75rem] text-center md:text-left md:w-1/2">
          Apus Network provides a robust and dynamic Edge Compute service
          tailored specifically for AI applications. By leveraging a distributed
          network of edge devices, we offer a seamless solution for AI tasks
          that require substantial computational resources.
        </div>
        <div
          id="solution-img"
          className="w-screen md:w-full md:h-full overflow-x-auto overflow-y-hidden md:mx-0 mt-16 md:mt-0 relative md:absolute md:top-0 md:left-0 md:bottom-0"
        >
          <img
            className="absolute bottom-0 left-14 md:left-auto translate-y-1/3 md:translate-y-0 max-w-none md:right-32 md:w-[67.5rem] h-[24rem] md:h-[34.75rem] opacity-60 md:opacity-100 -z-10"
            src={ImgHomepage.ResolutionDizuo}
          />
          <img
            className="md:absolute md:right-32 md:top-2/3 md:-translate-y-2/3 md:w-[67.5rem] h-150 md:h-[34.75rem] overflow-x-scroll max-w-none px-5 md:px-0"
            src={ImgHomepage.BgSolution}
          />
        </div>
        <div
          className="-z-10 absolute w-full h-full left-0 top-0"
          style={{
            boxShadow: "inset 0 0 64px rgba(255,255,255,0.1)",
          }}
        ></div>
        <div className="-z-10 absolute w-[124vw] h-[180vh] -bottom-[30vh] -left-[12vw] border-[32px] border-solid border-white blur-[50px] md:blur-[100px] rounded-[50%]"></div>
        <div className="-z-10 absolute w-[124vw] h-[180vh] -bottom-[14vh] -left-[12vw] border-[32px] border-solid border-[#6601AA] blur-[50px] md:blur-[100px] rounded-[50%]"></div>
        <div className="-z-10 absolute w-[124vw] h-[180vh] bottom-0 -left-[12vw] border-[32px] border-solid border-[#2715F1] blur-[50px] md:blur-[100px] rounded-[50%]"></div>
      </div>

      {/* Democratizing AI Compute Power */}
      <div className="section flex flex-col items-center justify-center">
        <div className=" leading-tight section-header text-center mb-6 md:mb-[3rem]">
          Democratizing
          <br />
          AI Compute Power
        </div>
        <div className="section-description mb-14 w-5/6 md:w-1/2 mx-auto text-center">
          Built on a decentralized network using AO and Arweave, Apus Network
          offers a seamless solution for AI tasks that demand substantial
          computational resources. Our service features the following benefits:
        </div>
        <div
          id="benifits"
          className="grid grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2 gap-5 md:gap-10 w-full"
        >
          <div className="md:col-span-1 md:row-span-1 relative p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col rounded-2xl overflow-hidden boreder-benifits">
            <img src={ImgHomepage.BiconGood} className="w-10 h-10 mb-4 md:mb-6" />
            <div className="text-2xl mb-4 md:mb-6 md:text-2xl xl:text-3xl text-nowrap">
              Public Goods
            </div>
            <div className="flex-1 text-xs md:text-base md:w-2/3 opacity-50">
              Apus Network's economic model incentivizes the development and
              execution of superior AI models. This competitive environment
              fosters innovation and ensures continuous advancements in AI
              technology.
            </div>
            <img
              src={isMobile ? ImgHomepage.BenifitsGood : ImgHomepage.BenifitsGoodPc}
              className={`max-w-none md:absolute md:right-0 md:top-0 md:h-full -z-10`}
              style={{
                width: isMobile ? "calc(100% + 5rem)" : "auto",
                marginLeft: isMobile ? "calc(-2.5rem + 1px)" : "",
                marginBottom: isMobile ? 1 : 0,
              }}
            />
          </div>
          <div className="md:row-start-2 md:row-end-2 md:col-start-1 md:col-end-1 relative p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col rounded-2xl overflow-hidden boreder-benifits">
            
            <img src={ImgHomepage.BiconEnergy} className="w-10 h-10 mb-4 md:mb-6" />
            <div className="text-2xl mb-4 md:mb-6 md:text-2xl xl:text-3xl text-nowrap">
              Energy Efficiency
            </div>
            <div className="text-xs md:text-base md:w-2/3 opacity-50 mb-4 md:mb-0">
              We optimize energy consumption by utilizing idle compute power
              across the network, contributing to a greener computing
              environment.
            </div>
            <img
              src={ImgHomepage.BenifitsEnergy}
              className={`md:absolute right-0 top-0 h-full -z-10`}
            />
          </div>
          <div className="md:row-span-2 relative p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col md:justify-end rounded-2xl overflow-hidden boreder-benifits">
            <img
              src={ImgHomepage.BiconAccessibility}
              className="w-10 h-10 mb-4 md:mb-6"
            />
            <div className="text-2xl mb-4 md:mb-6 md:text-2xl xl:text-3xl text-nowrap">
              Accessibility
            </div>
            <div className="flex-1 md:flex-grow-0 text-xs md:text-base md:w-2/3 opacity-50 mb-4 md:mb-0">
              We provide simple interfaces and comprehensive usage guides,
              enabling non-professional users to fully leverage AI capabilities.
            </div>
            <img
              src={isMobile ? ImgHomepage.BenifitsAccessibilityMobile : ImgHomepage.BenifitsAccessibility}
              className={`md:absolute -mx-10 max-w-none md:mx-0 md:right-px md:top-px md:h-4/5 -z-10 rounded-2xl`}
              style={{
                width: isMobile ? "calc(100% + 5rem - 2px)" : "auto",
                marginTop: isMobile ? 1 : 0,
                marginLeft: isMobile ? "calc(-2.5rem + 1px)" : "",
                marginBottom: isMobile ? 1 : 0,
              }}
            />
          </div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="section md:pt-none" style={{
        paddingBottom: isMobile ? 0 : "unset"
      }}>
        <div className="relative md:w-screen flex flex-col items-center" style={{
          height: isMobile ? "auto" : "calc(100vh - 5rem)"
        }}>
          <div className="section-header text-center">Powered By</div>
          <div className="mt-16 grid grid-cols-3 grid-flow-row gap-3 md:flex md:gap-6 md:items-center md:justify-center md:flex-wrap">
            {[
              { img: ImgHomepage.LogoArweave, height: "1.275rem" },
              { img: ImgHomepage.LogoDephy, height: "1.55rem" },
              { img: ImgHomepage.LogoAO, height: "1.025rem" },
              // { img: ImgHomepage.LogoSolana, height: "1.125rem" },
            ].map(({ img, height }, i) => (
              <div
                key={i}
                className="h-16 px-2 md:w-52 md:h-24 flex items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "#1e1e1e",
                }}
              >
                <img src={img} className="h-7" style={{ height }} />
              </div>
            ))}
          </div>
          <div className="section-header text-center mt-32 md:mt-64">Let's Build Together</div>
          <Link to={FooterSocialMediaList[0].path}><div className=" btn-colorful btn-main mt-12 md:mt-0 mb-32 md:mb-0">Get Our Updates</div></Link>
          <img
            src={ImgHomepage.BgBottom}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeIndex;
