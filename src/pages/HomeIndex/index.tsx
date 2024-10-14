import { FC, useLayoutEffect, useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { ImgHomepage } from "../../assets/image";
import { useBreakpoint } from "../../utils/react-use";
import { FooterSocialMediaList } from "../../config/menu";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";
import { useSubscribe } from "./context";
import { IconEmail } from "../../assets/common/common";
import Video from "../../assets/video.mp4";

const HomeIndex: FC = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
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
      { threshold: [0.5] },
    );

    observer.observe(document.querySelector("#benifits")!);

    return () => {
      observer.disconnect();
    };
  }, []);

  const [announcementShow, setAnnouncementShow] = useState<boolean>(
    localStorage.getItem("announcementShow") !== "false",
  );

  const { email, setEmail, subscribe } = useSubscribe();

  return (
    <div className="-z-10 relative">
      {announcementShow ? (
        <div
          className="bg-[#333333] rounded-lg bottom-3 md:bottom-auto md:top-24 left-1/2 -translate-x-1/2 p-6 flex items-center z-50"
          style={{
            width: isMobile ? "calc(100% - 1.5rem)" : "60rem",
            position: "fixed",
          }}
        >
          <img src={ImgHomepage.IconAnnouncement} className="w-5 h-5 mr-4" />
          <div className="text-[10px] md:text-sm text-white flex-1 mr-6">
            Apus Network has migrated to AO! Click on Console in the top right
            to explore our testnet Competition Pools and Playground for the
            chance to earn Apus_Tn1 token rewards.
          </div>
          <div
            className="btn-main btn-small btn-colorful"
            onClick={() => {
              localStorage.setItem("announcementShow", "false");
              setAnnouncementShow(false);
            }}
          >
            Got It
          </div>
        </div>
      ) : null}
      {/* Hero */}
      <div className="section-container h-screen min-h-[960px] relative">
        <video
          className="absolute w-full h-full right-0 bottom-0 object-cover -z-10"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={Video} type="video/mp4" />
        </video>
        <div className="section h-full flex flex-col items-center md:items-start">
          <div className="mt-56 md:mt-[320px] md:text-left text-[#333333] text-center font-bold text-5xl md:text-8xl leading-[1.1]">
            Trustless {isMobile ? <br /> : ""}GPU Network
            <br />
            for AI on AO
          </div>
          <div className="flex gap-4 md:gap-6 mt-20 justify-center md:justify-start items-center flex-wrap">
            {FooterSocialMediaList.map(({ name, path, icon }) => (
              <Link
                to={path}
                key={name}
                className="hover:scale-105 transition-transform duration-300"
              >
                <img src={icon} alt={name} className="h-4 md:h-[1.75rem]" />
              </Link>
            ))}
            <div
              className="h-[1.75rem] md:h-[2.865rem] w-[16.25rem] md:w-[28rem] px-2 flex items-center
            bg-[#fbfbfb] drop-shadow-lg rounded-sm md:rounded-lg"
            >
              <img
                src={IconEmail}
                alt="icon-email"
                className="w-4 h-[0.625rem] md:w-8 md:h-6"
              />
              <input
                placeholder="youremail@gmail.com"
                className="flex-1 h-full md:mx-2 px-2 text-[10px] md:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <div
                className="h-[1.125rem] md:h-8 w-16 md:w-32 text-center bg-gray33 leading-[1.125rem] md:leading-8 font-bold text-[10px] md:text-sm text-white rounded-sm md:rounded-lg cursor-pointer"
                onClick={subscribe}
              >
                SUBSCRIBE
              </div>
            </div>
          </div>
          <div className="w-full mt-32 flex justify-center items-center gap-6 z-10">
            <div className="btn-colorful btn-main active">
              Go To Competition Pools &amp; Playground
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(243,243,243,1) 0%, rgba(177,177,177,1) 100%)",
        }}
      >
        {/* Benifits */}
        <div className="section-container md:py-[10rem]">
          <div className="section flex flex-col items-center justify-center">
            <div className="section-header text-center mb-6 md:mb-[3rem]">
              Key Features
            </div>
            <div className="section-description mb-6 md:mb-[6rem] md:mx-auto text-center">
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
                },
                {
                  title: `Cost-Effective AI<br/>Training and Inference`,
                  describe:
                    "Apus Network utilizes GPU mining nodes to perform optimal, trustless model training and inference on Arweave.",
                  img: ImgHomepage.FeaturesCost,
                },
              ].map(({ title, describe, img }) => (
                <div key={title} className="benifits-item card-dark">
                  <div className="relative p-5 rounded-2xl h-full flex flex-col overflow-hidden gap-[1.75rem]">
                    <img src={img} className="rounded-2xl" />
                    <div
                      className="text-2xl md:text-3xl text-nowrap font-semibold text-white"
                      dangerouslySetInnerHTML={{ __html: title }}
                    ></div>
                    <div className="text-xs mb-8 md:mb-9 md:text-base text-white leading-normal opacity-50">
                      {describe}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div
          className="section-container p-none relative"
          style={{
            background:
              "radial-gradient(circle at 50% 70%, #7028CC 0%, rgba(255,255,255, 0%) 50%, transparent 50%, transparent 100%)",
          }}
        >
          <div className="section md:px-5 md:pt-[10rem] flex flex-col items-center">
            <div className="section-header mt-12 md:mt-0 z-10">
              How it works
            </div>
            <div className="section-description text-center z-10">
              Use a competitive pool mechanism to find the best models. Achieve
              deterministic GPUs by modifying CUDA and other software. Implement
              AI inference and training on the AO platform, allowing miners to
              join permissionlessly, resulting in cost-effective AI.
            </div>
          </div>
          <div
            id="solution-img"
            className="w-screen md:w-full overflow-x-auto overflow-y-hidden mt-16 relative md:flex md:justify-center z-10"
          >
            <img
              className="relative md:w-[68rem] h-150 md:h-[38rem] md:mb-24 overflow-x-scroll max-w-none px-5 md:px-0 z-10"
              src={ImgHomepage.BgSolution}
            />
            <img
              className="absolute bottom-0 left-14 md:left-1/2 md:-translate-x-1/2 translate-y-1/3 md:translate-y-0 max-w-none md:w-[67.5rem] h-[24rem] md:h-[34.75rem] opacity-60 md:opacity-100"
              src={ImgHomepage.ResolutionDizuo}
            />
          </div>
        </div>

        {/* Democratizing AI Compute Power */}
        <div className="section-container md:py-24">
          <div className="section flex flex-col items-center justify-center">
            <div className=" leading-tight section-header text-center mb-6 md:mb-[3rem]">
              Democratizing
              <br />
              AI Compute Power
            </div>
            <div className="section-description mb-14 mx-auto text-center">
              Built on a decentralized network using AO and Arweave, Apus
              Network offers a seamless solution for AI tasks that demand
              substantial computational resources. Our service features the
              following benefits:
            </div>
            <div
              id="benifits"
              className="md:grid md:grid-cols-2 md:grid-rows-2 flex flex-col gap-5 md:gap-10 w-full"
            >
              <div className="md:col-span-1 md:row-span-1 card-dark">
                <div className="relative h-full p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col rounded-2xl overflow-hidden">
                  <img
                    src={ImgHomepage.BiconGood}
                    className="w-10 h-10 mb-4 md:mb-6"
                  />
                  <div className="text-2xl mb-4 md:mb-6 md:text-2xl xl:text-3xl text-nowrap text-white font-semibold">
                    Public Good
                  </div>
                  <div className="flex-1 text-xs md:text-base md:w-2/3 opacity-50 text-white">
                    Apus Network's economic model incentivizes the development
                    and execution of superior AI models. This competitive
                    environment fosters innovation and ensures continuous
                    advancements in AI technology.
                  </div>
                  <img
                    src={
                      isMobile
                        ? ImgHomepage.BenifitsGood
                        : ImgHomepage.BenifitsGoodPc
                    }
                    className={`max-w-none md:absolute md:right-0 md:top-0 md:h-full`}
                    style={{
                      width: isMobile ? "calc(100% + 5rem)" : "auto",
                      marginLeft: isMobile ? "calc(-2.5rem)" : "",
                      marginBottom: isMobile ? 1 : 0,
                    }}
                  />
                </div>
              </div>
              <div className="md:row-start-2 md:row-end-2 md:col-start-1 md:col-end-1 card-dark">
                <div className="relative h-full p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col rounded-2xl overflow-hidden">
                  <img
                    src={ImgHomepage.BiconEnergy}
                    className="w-10 h-10 mb-4 md:mb-6"
                  />
                  <div className="text-2xl mb-4 md:mb-6 md:text-2xl xl:text-3xl text-nowrap text-white font-semibold">
                    Energy Efficiency
                  </div>
                  <div className="text-xs md:text-base md:w-2/3 opacity-50 mb-4 md:mb-0 text-white">
                    We optimize energy consumption by utilizing idle compute
                    power across the network, contributing to a greener
                    computing environment.
                  </div>
                  <img
                    src={
                      isMobile
                        ? ImgHomepage.BenifitsEnergyMobile
                        : ImgHomepage.BenifitsEnergy
                    }
                    className={`md:absolute top-0 right-0 h-full`}
                  />
                </div>
              </div>
              <div className="md:row-span-2 card-dark">
                <div className="relative h-full p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col md:justify-end rounded-2xl overflow-hidden">
                  <img
                    src={ImgHomepage.BiconAccessibility}
                    className="w-10 h-10 mb-4 md:mb-6"
                  />
                  <div className="text-2xl mb-4 md:mb-6 md:text-2xl xl:text-3xl text-nowrap text-white font-semibold">
                    Accessibility
                  </div>
                  <div className="flex-1 md:flex-grow-0 text-xs md:text-base md:w-2/3 opacity-50 mb-4 md:mb-0 text-white">
                    We provide simple interfaces and comprehensive usage guides,
                    enabling non-professional users to fully leverage AI
                    capabilities.
                  </div>
                  <img
                    src={
                      isMobile
                        ? ImgHomepage.BenifitsAccessibilityMobile
                        : ImgHomepage.BenifitsAccessibility
                    }
                    className={`md:absolute -mx-10 max-w-none md:mx-0 md:right-px md:top-px md:h-4/5 rounded-2xl`}
                    style={{
                      width: isMobile ? "calc(100% + 5rem)" : "auto",
                      marginTop: isMobile ? 1 : 0,
                      marginLeft: isMobile ? "calc(-2.5rem)" : "",
                      marginBottom: isMobile ? 1 : 0,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="roadmap"
          className="section-container relative md:pt-none"
          style={{
            paddingBottom: isMobile ? 0 : "unset",
          }}
        >
          <div className="section flex flex-col items-center">
            <div className="section-header md:text-5xl mt-12 md:mt-16 text-center">
              Roadmap
            </div>
            <img
              className="mt-12"
              src={isMobile ? ImgHomepage.RoadmapVtl : ImgHomepage.Roadmap}
              alt="roadmap"
            />
          </div>
        </div>

        {/* Trusted By */}
        <div
          className="section-container relative md:pt-none"
          style={{
            paddingBottom: isMobile ? 0 : "unset",
          }}
        >
          <div className="section flex flex-col items-center">
            <div className="section-header md:text-5xl mt-12 md:mt-16 text-center">
              Powered By
            </div>
            <div className="flex flex-wrap gap-2 md:gap-6 items-center justify-center mt-6 md:mt-12">
              {[
                {
                  img: ImgHomepage.LogoArweave,
                  height: isMobile ? "1.125rem" : "1.875rem",
                },
                {
                  img: ImgHomepage.LogoDephy,
                  height: isMobile ? "1.375rem" : "2.25rem",
                },
                {
                  img: ImgHomepage.LogoArIO,
                  height: isMobile ? "1.625rem" : "2.875rem",
                },
                {
                  img: ImgHomepage.LogoAO,
                  height: isMobile ? "0.875rem" : "1.625rem",
                },
                // { img: ImgHomepage.LogoSolana, height: "1.125rem" },
              ].map(({ img, height }, i) => (
                <div
                  key={i}
                  className="px-2 w-28 h-14 md:w-52 md:h-24 flex items-center justify-center rounded-lg -order-1 md:-order-none"
                  style={{
                    backgroundColor: "#333333",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <img src={img} className="h-7" style={{ height }} />
                </div>
              ))}
            </div>
            <div className="section-header text-center mt-24 md:mt-40">
              Know Apus Better
            </div>
            <TwitterVideo className="mt-6" />
            <div className="section-header text-center mt-24 md:mt-40">
              Stay Up to Date - Subscribe Now
            </div>
            <div className="section-description text-center text-gray33">
              Follow us on our social media or subscribe to our email newsletter
              to get the latest updates
            </div>
            <div className="flex gap-4 md:gap-6 mt-8 md:mt-16 justify-center md:justify-start items-center flex-wrap z-10">
              {FooterSocialMediaList.map(({ name, path, icon }) => (
                <Link
                  to={path}
                  key={name}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <img src={icon} alt={name} className="h-4 md:h-[1.75rem]" />
                </Link>
              ))}
            </div>
            <div
              className="h-[1.75rem] md:h-[2.865rem] w-[16.25rem] md:w-[28rem] px-2 flex items-center mt-4 md:mt-8 mb-10 md:mb-20 z-10
                bg-[#fbfbfb] drop-shadow-lg rounded-sm md:rounded-lg"
            >
              <img
                src={IconEmail}
                alt="icon-email"
                className="w-4 h-[0.625rem] md:w-8 md:h-6"
              />
              <input
                placeholder="youremail@gmail.com"
                className="flex-1 h-full md:mx-2 px-2 text-[10px] md:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <div
                className="h-[1.125rem] md:h-8 w-16 md:w-32 text-center bg-gray33 leading-[1.125rem] md:leading-8 font-bold text-[10px] md:text-sm text-white rounded-sm md:rounded-lg cursor-pointer"
                onClick={subscribe}
              >
                SUBSCRIBE
              </div>
            </div>
          </div>
          <img
            src={ImgHomepage.BgBottom}
            className="absolute bottom-0 md:w-[72rem] left-1/2 -translate-x-1/2"
          />
        </div>
      </div>
    </div>
  );
};

const Homepage: FC = () => {
  return (
    <div id="homepage">
      <HomeHeader />
      <HomeIndex />
      <HomeFooter />
    </div>
  );
};

export default Homepage;

const TwitterVideo = ({ className }: { className: string }) => (
  <iframe
    className={`w-[35rem] h-[20rem] max-w-full ${className}`}
    src="https://www.youtube.com/embed/-rPbCeCbJVc?si=778KTA2eKneoQLDF"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  ></iframe>
);
