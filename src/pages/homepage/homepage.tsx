import "./index.css";
import { Link } from "react-router-dom";
import { useBreakpoint } from "../../utils/react-use";

import Rive from "@rive-app/react-canvas";
import HeroRiv from "./animations/hero.riv";
import Feat1 from './animations/apus_hero_verifiable_v3.riv';
import Feat2 from './animations/apus_hero_community_v1.riv';
import Feat3 from './animations/apus_incentives_v1.riv';
import IconMintBox from "./images/mint-box-icon.png";
import BgDesc from "./images/bg-desc.png";
import BgDescMobile from "./images/bg-desc.svg";
import Arch from "./images/arch.svg";
import ArchMobile from "./images/arch-mobile.svg";
import LogoStroke from "./images/logo-stroke.svg";
import BgRoadmap from "./images/roadmap-bg.png";
import BgRoadmapMobile from "./images/plexus-mobile.png";
import RoadmapLine from "./images/roadmap-line.svg";
import RoadmapLineMobile from "./images/roadmap-line-mobile.svg";
import LogoAO from "./images/ao.svg";
import LogoArweave from "./images/arweave.svg";
import LogoArio from "./images/ario.svg";
import LogoEnlarge from "./images/logo-enlarge.svg";
import { LIGHTPAPER_LINK } from "../../components/HomeHeader";
import { ImgHomepage } from "../../assets";
import { TokenomicsDocLink } from "../../components/constants";

function TwitterVideo({ className, videoID }: { className?: string; videoID: string }) {
  return (
    <iframe
      className={`flex-shrink-0 w-full h-[250px] md:w-[440px] md:h-[330px] ${className}`}
      src={`https://www.youtube.com/embed/${videoID}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      loading="lazy"
    ></iframe>
  );
}

function SectionHero() {
  return (
    <div className="section section-hero">
      <div className="content-area relative z-20 flex flex-col items-center md:block">
        <div className="relative w-full text-[35px] px-[18px] md:text-[80px] text-[#262626] mt-[230px] pb-[80px] md:mt-[140px] md:px-0 md:pb-[430px] font-medium md:font-normal leading-none bg-white md:bg-transparent">
        <div className="md:hidden absolute -top-5 left-0 right-0 h-5 bg-gradient-to-b from-transparent to-white backdrop-filter backdrop-blur-sm"></div>
          Enabling Verifiable
          <br /> Decentralized AI
          <br />
          <span className="text-[#7b7b7b]">through</span>
          <br /> Deterministic GPU
          <br /> Computing
        </div>
        <div className="md:absolute right-0 bottom-0 md:px-[45px] py-6 md:py-[32px] w-full md:w-auto bg-[#3242F5] flex flex-col gap-2 md:gap-0 md:flex-row items-center">
          <img src={IconMintBox} className="w-[90px] h-[90px] md:w-[175px] md:h-[175px] md:mr-[42px]" />
          <div className="flex flex-col items-center md:items-start gap-2 md:gap-5">
            <div className="text-2xl md:text-[40px] text-white">APUS Minting Live!</div>
            <Link to="/mint">
              <div className="w-[116px] h-[42px] md:w-[140px] md:h-[56px] leading-[42px] md:leading-[56px] rounded-lg bg-white hover:bg-slate-200 text-base md:text-lg font-space-mono text-[#1b1b1b] text-center">
                Mint APUS
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionDesc() {
  const breakpoint = useBreakpoint();
  return (
    <div className="section md:h-[460px] bg-[#f1f1f1] z-0 py-[50px] px-[25px] md:p-0 flex flex-col gap-5 md:block">
      <img
        src={breakpoint === "mobile" ? BgDescMobile : BgDesc}
        className="md:absolute md:right-[50%] md:top-[88px] md:w-[50%] h-[96px] md:h-[290px] md:object-cover md:object-right"
      />
      <div className="md:absolute md:left-[56%] md:top-[170px] md:w-[460px] text-base md:text-[22px] text-[#262626]">
        Apus Network is building towards a decentralized, trustless GPU network dedicated to empowering verifiable deAI
        inference through deterministic GPU computing.
      </div>
    </div>
  );
}

function SectionFeatures() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  return (
    <div className="section">
      <div className="content-area text-[#1b1b1b] ">
        <div className="features-item">
          <div className="bg-[#1b1b1b] h-[418px] md:h-full w-full md:w-1/2">
            {isMobile ? <Rive src={Feat1} stateMachines={"State Machine 1"} className="relative left-5 h-[286px]" /> : null}
          </div>
          <div className="features-item-content">
            <div className="features-item-title">Verifiable Decentralized AI Inference</div>
            <div className="features-item-desc">
              Apus Network introduces Fast Provable Inference Faults(FPIF) to combine deterministic computations,
              cryptographic attestations, and economic incentives for fast, secure, and inexpensive verification.
            </div>
            <Link
              to="https://r2krpzvyn24gq75rtedeo56vpiyxvcya2xsntoeaz7ursparocea.arweave.net/jpUX5rhuuGh_sZkGR3fVejF6iwDV5Nm4gM_pGTwRcIg"
              target="__blank"
            >
              <div className="btn-lightblue">Learn More</div>
            </Link>
          </div>
        </div>
        <div className="features-item">
          <div className={`features-item-content ${isMobile ? "order-2" : "order-1"}`}>
            <div className="features-item-title">100% Community Launch</div>
            <div className="features-item-desc">
              $APUS, with a fixed 1 billion supply and deflationary mechanisms, ensures long-term value through fair,
              decentralized distribution with no pre-allocation for the team or early investors.
            </div>
            <Link
              to={TokenomicsDocLink}
              target="__blank"
            >
              <div className="btn-lightblue">Learn More</div>
            </Link>
          </div>
          <div
            className={`bg-[#1b1b1b] h-[418px] md:h-full w-full md:w-1/2 overflow-hidden ${isMobile ? "order-1" : "order-2"}`}
          >
            {isMobile ? <Rive src={Feat2} stateMachines={"State Machine 1"} className="h-[448px] mx-auto" /> : null}
          </div>
        </div>
        <div className="features-item">
          <div className="bg-[#3242f5] h-[418px] md:h-full w-full md:w-1/2 overflow-hidden">
            {isMobile ? <Rive src={Feat3} stateMachines={"State Machine 1"} className="h-[460px] relative -left-10" /> : null}
          </div>
          <div className="features-item-content">
            <div className="features-item-title">Competitive Incentive for AI Models</div>
            <div className="features-item-desc">
              Apus Network's economic model competitively incentivizes the development and execution of the top-tier AI
              models, aligning computational integrity with community-driven rewards.
            </div>
            <Link
              to="https://r2krpzvyn24gq75rtedeo56vpiyxvcya2xsntoeaz7ursparocea.arweave.net/jpUX5rhuuGh_sZkGR3fVejF6iwDV5Nm4gM_pGTwRcIg"
              target="__blank"
            >
              <div className="btn-lightblue">Learn More</div>
            </Link>
          </div>
        </div>
      </div>
      {isMobile ? null : (
        <>
          <Rive src={Feat1} stateMachines={"State Machine 1"} className="absolute right-[48%] top-0 md:w-[421px] md:h-[289px] lg:w-[505px] lg:h-[347px] xl:w-[630px] xl:h-[433px] z-10" />
          <Rive src={Feat2} stateMachines={"State Machine 1"} className="absolute left-[55%] top-[700px] md:w-[391px] md:h-[462px] lg:w-[469px] lg:h-[554px] xl:w-[586px] xl:h-[693px] md:scale-125 z-10" />
          <Rive src={Feat3} stateMachines={"State Machine 1"} className="absolute right-[45%] -bottom-[80px] md:w-[550px] md:h-[467px] lg:w-[660px] lg:h-[560px] xl:w-[826px] xl:h-[700px] z-10" />
        </>
      )}
    </div>
  );
}

function SectionTech() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  return (
    <div className="section bg-[#1b1b1b] overflow-hidden">
      {isMobile ? null : <img src={LogoStroke} className="absolute right-[65%] top-[100px] z-10" />}
      <div className="content-area flex flex-col items-center gap-[30px] md:gap-10 pt-[20px] pb-[40px] md:pt-40 md:pb-24">
        <div className="text-white text-[30px] md:text-[60px] font-semibold md:font-normal leading-none">
          How It Works
        </div>
        <img src={isMobile ? ArchMobile : Arch} className="z-20" />
        <Link to={LIGHTPAPER_LINK} target="_blank">
          <img
            src={LogoEnlarge}
            className="w-[25px] h-[25px] md:w-[40px] md:h-[40px] md:absolute md:right-[32px] md:top-[170px] cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
}

function SectionVideo() {
  return (
    <div className="section px-[25px] md:px-0 py-[50px] md:py-40">
      <div className="content-area">
        <div className="text-[30px] md:text-[60px] font-semibold md:font-normal text-[1b1b1b] mb-[30px] md:mb-[75px] text-center leading-none">
          Verifiable AI Inference
        </div>
        <div className="flex flex-col md:flex-row flex-nowrap md:overflow-x-scroll w-full gap-[30px] md:gap-10">
          <TwitterVideo videoID="-rPbCeCbJVc?si=778KTA2eKneoQLDF" />
          <TwitterVideo videoID="2ympIENaQYQ?si=JVN0KMTmDxVBVyAU" />
          <TwitterVideo videoID="nMl9iW9WPt8?si=7zrmAW_bNczyQXbd" />
        </div>
      </div>
    </div>
  );
}

function SectionRoadmap() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  return (
    <div id="roadmap" className="section md:pt-10 md:pb-40 overflow-hidden">
      <div className="content-area relative flex flex-col md:flex-row md:gap-10">
        <div className="flex-shrink-0 md:w-[470px] text-white z-20">
          <div className="bg-[#1b1b1b] md:pt-[72px] md:px-[36px] md:pb-[48px] py-[50px] px-[25px]">
            <div className="text-[30px] md:text-[60px] font-semibold md:font-normal leading-none mb-[30px] md:mb-[34px]">
              Roadmap
            </div>
            <div className="text-base md:text-xl leading-tight">
              To achieve the seamless integration and enhancement of Fast Provable Inference Faults (FPIF ML) within the
              AO Protocol and Arweave ecosystem, Apus Network has outlined a comprehensive roadmap.
              <br />
              <br />
              This roadmap details the phased development and implementation milestones from Q1 2025 onwards.
            </div>
          </div>
        </div>
        <img
          src={isMobile ? BgRoadmapMobile : BgRoadmap}
          className="md:absolute md:-left-[410px] md:top-[150px] md:w-[880px] md:h-[1045px] h-[280px] z-10"
        />
        <div className="px-[25px] pb-[50px] md:pb-0 md:px-0 text-[#1b1b1b] text-base md:text-[22px] leading-tight flex flex-col gap-[50px] md:gap-20">
          {[
            {
              season: "2025 Q1",
              title: "HyperBEAM Device Integration",
              todos: [
                "Establish initial GPU Device integration with HyperBEAM",
                "Implement d11c llama.cpp with NVIDIA GPU",
                "List on PermaSwap DEX",
              ],
            },
            {
              season: "2025 Q2",
              title: "Launch AI Pool and Substaking",
              todos: [
                "Launch AI Pool product with $APUS substaking",
                "Build AO mainnet GPU nodes and conduct limited public testing",
                "Expand DEX listings to enhance liquidation",
              ],
            },
            {
              season: "2025 H2",
              title: "Expand Ecosystem Influence",
              todos: [
                "Position $APUS as a utility token",
                "Boost platform appeal and market engagement",
                "Foster cross-ecosystem collaboration and drive project execution",
              ],
            },
          ].map(({ season, title, todos }, index) => {
            return (
              <div className="flex flex-col md:flex-row gap-[20px] md:gap-[36px]" key={season}>
                <div
                  className={`relative w-[130px] h-[48px] md:w-[170px] md:h-[63px] flex-shrink-0 text-2xl leading-[48px] md:leading-[63px] text-center polygon-box ${index === 0 ? "blue" : ""}`}
                >
                  {season}
                  {index === 0 && (
                    <img
                      src={isMobile ? RoadmapLineMobile : RoadmapLine}
                      className="absolute bottom-0 right-0 md:-bottom-[112px] md:right-[2px] md:h-[120px]"
                    />
                  )}
                </div>
                <div>
                  <div className="mb-5 md:my-4 text-[30px] leading-none">{title}</div>
                  <ul className=" list-disc pl-6">
                    {todos.map((todo) => (
                      <li key={todo}>{todo}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const PoweredBy = [
  {
    icon: LogoAO,
    height: 67,
  },
  {
    icon: LogoArweave,
    height: 61,
  },
  {
    icon: LogoArio,
    height: 69,
  },
];

const {
  LogoBulbaswap,
  LogoVeritas,
  LogoDephy,
  Logo0rbit,
  LogoDecentramind,
  LogoAstra,
  LogoBuildify,
  LogoAogames,
  LogoFd,
  LogoWeb3amsterdam,
  LogoCredible,
  LogoGlobalstake,
  LogoPrimus,
} = ImgHomepage;
const partners = [
  {
    Logo: LogoBulbaswap,
    height: 50,
  },
  {
    Logo: LogoVeritas,
    height: 30,
  },
  {
    Logo: LogoDephy,
    height: 43,
  },
  {
    Logo: Logo0rbit,
    height: 48,
  },
  {
    Logo: LogoDecentramind,
    height: 44,
  },
  {
    Logo: LogoAstra,
    height: 34,
  },
  {
    Logo: LogoBuildify,
    height: 52,
  },
  {
    Logo: LogoAogames,
    height: 57,
  },
  {
    Logo: LogoFd,
    height: 61,
  },
  {
    Logo: LogoWeb3amsterdam,
    height: 44,
  },
  {
    Logo: LogoCredible,
    height: 24,
  },
  {
    Logo: LogoGlobalstake,
    height: 26,
  },
  {
    Logo: LogoPrimus,
    height: 34,
  },
];

function SectionPartners() {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  return (
    <div className="section w-full bg-[#f1f1f1] py-[30px] px-[25px] md:mx-0 md:pt-[64px] md:pb-[100px]">
      <div className="content-area flex flex-col items-center">
        <div className="text-[30px] md:text-[60px] font-semibold md:font-normal leading-none mb-10 md:mb-20">
          Powered by
        </div>
        <div className="flex flex-wrap gap-[30px] md:gap-[70px] justify-center items-center">
          {PoweredBy.map(({ icon, height }) => (
            <div className="section-powered-item" key={icon}>
              <img src={icon} style={{ height: height * (isMobile ? 0.6667 : 1) }} />
            </div>
          ))}
        </div>
        <div className="text-[30px] md:text-[60px] font-semibold md:font-normal leading-none my-10 md:my-20">
          Partners
        </div>
        <div className="section-partner-list">
          {partners.map(({ Logo, height }) => (
            <img key={Logo} src={Logo} style={{ height: height * (isMobile ? 0.73 : 1) }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeIndex() {
  const breakpoint = useBreakpoint();
  return (
    <div id="homepage" className="relative w-screen overflow-x-hidden">
      <SectionHero />
      {breakpoint === "mobile" ? (
        <Rive
          src={HeroRiv}
          className="absolute left-0 top-[80px] w-[100%] h-[460px] z-10"
        />
      ) : (
        <Rive
        src={HeroRiv}
          className="absolute left-0 top-[80px] md:left-[45%] md:top-[50px] w-full md:w-[1147px] md:h-[1154px] z-10"
        />
      )}
      <SectionDesc />
      <SectionFeatures />
      <SectionTech />
      <SectionVideo />
      <SectionRoadmap />
      <SectionPartners />
    </div>
  );
}
