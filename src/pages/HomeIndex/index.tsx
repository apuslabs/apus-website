import { FC, useLayoutEffect, useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { ImgHomepage } from "../../assets/image";
import { useBreakpoint } from "../../utils/react-use";
import { FooterSocialMediaList } from "../../config/menu";
import HomeHeader from "../../components/HomeHeader";
import HomeFooter from "../../components/HomeFooter";

const HomeIndex: FC = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

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

  const [announcementShow, setAnnouncementShow] = useState<boolean>(localStorage.getItem('announcementShow') !== 'false');

  return (
    <div>
      {announcementShow ? (
        <div
          className="boreder-benifits bottom-3 md:bottom-auto md:top-24 left-1/2 -translate-x-1/2 p-6 flex items-center z-50"
          style={{
            width: isMobile ? "calc(100% - 1.5rem)" : "60rem",
            position: "fixed"
          }}
        >
          <img src={ImgHomepage.IconAnnouncement} className="w-5 h-5 mr-4" />
          <div className="text-xs md:text-sm text-white flex-1 mr-6">
            Apus has removed Ecosystem, Playground, Task and Connect Wallet. In
            the meantime your APUS_Tn1 have been retained, and a new incentive
            mechanism will be added in the future. Stay tuned!
          </div>
          <div
            className="btn-main btn-small btn-colorful"
            onClick={() => {
              localStorage.setItem('announcementShow', 'false')
              setAnnouncementShow(false);
            }}
          >
            Got It
          </div>
        </div>
      ) : null}
      {/* Hero */}
      <div
        className="section-container h-screen min-h-[56vw] relative"
        style={{
          backgroundImage: `url(${ImgHomepage.BgHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="section h-full flex flex-col">
          <div className="text-white text-center mx-auto mt-20 md:mt-28 xl:mt-32 2xl:mt-40 text-medium text-4xl md:text-[4rem] leading-[1.1]">
            Trustless GPU Network<br/>for AI on AO
          </div>
          <div className="flex-1 flex justify-center items-end gap-6 pb-24 z-10">
            <div className=" btn-colorful btn-main" onClick={() => {
              window.open("https://apus-network.gitbook.io/apus-console-docs/ao/benchmark-poc", "_blank");
            }}>Benchmark POC</div>
            <div className="btn-main" onClick={() => {
              window.open("https://apus-network.gitbook.io/apus-console-docs/", "_blank");
            }}>Know Apus More</div>
          </div>
        </div>
      </div>
      {/* Benifits */}
      <div className="section-container md:py-[10rem]">
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
                className="benifits-item boreder-benifits"
              >
                <div className="relative p-10 rounded-2xl h-full flex flex-col overflow-hidden">
                  <div
                    className="text-2xl mb-8 md:mb-10 md:text-2xl xl:text-3xl text-nowrap"
                    dangerouslySetInnerHTML={{ __html: title }}
                  ></div>
                  <div className="flex-1 text-xs mb-8 md:mb-9 md:text-base opacity-50">
                    {describe}
                  </div>
                  <img src={img} className={`opacity-0 ${imgClassName ?? ""}`} />
                  <img
                    src={img}
                    className={`absolute bottom-0 ${imgClassName ?? ""}`}
                  />
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
          backgroundImage: `url(${ImgHomepage.BgArch})`,
          backgroundSize: "100% 100%",
        }}
      >
        <div className="section md:px-5 md:pt-[10rem] flex flex-col items-center">
          <div className="section-header mt-12 md:mt-0 z-10">How it works</div>
          <div className="section-description w-[18.75rem] text-center md:w-[40rem] z-10">
          Use a competitive pool mechanism to find the best models. Achieve deterministic GPUs by modifying CUDA and other software. Implement AI inference and training on the AO platform, allowing miners to join permissionlessly, resulting in cost-effective AI.
          </div>
        </div>
        <div
          id="solution-img"
          className="w-screen md:w-full overflow-x-auto overflow-y-hidden mt-16 relative md:flex md:justify-center z-10"
        >
          <img
            className="md:w-[68rem] h-150 md:h-[38rem] md:mb-24 overflow-x-scroll max-w-none px-5 md:px-0 z-10"
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
          <div className="section-description mb-14 w-5/6 md:w-1/2 mx-auto text-center">
            Built on a decentralized network using AO and Arweave, Apus Network
            offers a seamless solution for AI tasks that demand substantial
            computational resources. Our service features the following
            benefits:
          </div>
          <div
            id="benifits"
            className="md:grid md:grid-cols-2 md:grid-rows-2 flex flex-col gap-5 md:gap-10 w-full"
          >
            <div className="md:col-span-1 md:row-span-1 boreder-benifits darker">
            <div className="relative h-full p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col rounded-2xl overflow-hidden">
              <img
                src={ImgHomepage.BiconGood}
                className="w-10 h-10 mb-4 md:mb-6"
              />
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
                src={
                  isMobile
                    ? ImgHomepage.BenifitsGood
                    : ImgHomepage.BenifitsGoodPc
                }
                className={`max-w-none md:absolute md:right-0 md:top-0 md:h-full -z-10`}
                style={{
                  width: isMobile ? "calc(100% + 5rem)" : "auto",
                  marginLeft: isMobile ? "calc(-2.5rem)" : "",
                  marginBottom: isMobile ? 1 : 0,
                }}
              />
            </div>
            </div>
            <div className="md:row-start-2 md:row-end-2 md:col-start-1 md:col-end-1 boreder-benifits darker">
            <div className="relative h-full p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col rounded-2xl overflow-hidden">
              <img
                src={ImgHomepage.BiconEnergy}
                className="w-10 h-10 mb-4 md:mb-6"
              />
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
            </div>
            <div className="md:row-span-2 boreder-benifits darker">
            <div className="relative h-full p-10 pb-0 md:p-4 md:py-6 md:px-10 flex flex-col md:justify-end rounded-2xl overflow-hidden">
              <img
                src={ImgHomepage.BiconAccessibility}
                className="w-10 h-10 mb-4 md:mb-6"
              />
              <div className="text-2xl mb-4 md:mb-6 md:text-2xl xl:text-3xl text-nowrap">
                Accessibility
              </div>
              <div className="flex-1 md:flex-grow-0 text-xs md:text-base md:w-2/3 opacity-50 mb-4 md:mb-0">
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
                className={`md:absolute -mx-10 max-w-none md:mx-0 md:right-px md:top-px md:h-4/5 -z-10 rounded-2xl`}
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

      {/* Trusted By */}
      <div
        className="section-container relative md:pt-none"
        style={{
          paddingBottom: isMobile ? 0 : "unset",
        }}
      >
        <div className="section flex flex-col items-center">
          <div className="section-header mt-12 md:mt-16 mb-16 text-center">Powered By</div>
          <div className="flex flex-wrap gap-6 items-center justify-center md:flex-wrap">
            {[
              { img: ImgHomepage.LogoArweave, height: "1.875rem" },
              { img: ImgHomepage.LogoDephy, height: "2.25rem" },
              { img: ImgHomepage.LogoAO, height: "1.625rem" },
              // { img: ImgHomepage.LogoSolana, height: "1.125rem" },
            ].map(({ img, height }, i) => (
              <div
                key={i}
                className="flex-0 h-16 px-2 w-44 md:w-52 md:h-24 flex items-center justify-center rounded-lg -order-1 md:-order-none"
                style={{
                  backgroundColor: "#161616",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <img src={img} className="h-7" style={{ height }} />
              </div>
            ))}
          </div>
          <div className="section-header text-center mt-24 md:mt-40">
            Know Apus Better
          </div>
          <TwitterVideo />
          <div className="section-header text-center mt-24 md:mt-40">
            Let's Build Together
          </div>
          <Link to={FooterSocialMediaList[0].path}>
            <div className=" btn-colorful btn-main mb-24 md:mb-[16rem]">
              Get Our Updates
            </div>
          </Link>
        </div>
        <img
          src={ImgHomepage.BgBottom}
          className="absolute bottom-0 md:w-[72rem] left-1/2 -translate-x-1/2 -z-10"
        />
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
  )
}

export default Homepage;


const TwitterVideo = () => <iframe className="w-[35rem] h-[20rem] max-w-full" src="https://www.youtube.com/embed/-rPbCeCbJVc?si=778KTA2eKneoQLDF" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>