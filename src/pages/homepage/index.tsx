import { ApusLogo, ImgHomepage } from "../../assets";
import { useSubscribe } from "./contexts";
import "./index.css";
import { Input } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { SocialMediaList } from "../../components/SocialMediaList";
import { useBreakpoint, useCountDate } from "../../utils/react-use";
import { TGE_TIME } from "../../utils/config";

function TwitterVideo({ className, videoID }: { className: string; videoID: string }) {
  return (
    <iframe
      className={`w-full h-[220px] md:w-[730px] md:h-[412px] ${className}`}
      src={`https://www.youtube.com/embed/${videoID}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
}

function Email() {
  const { email, setEmail, subscribe } = useSubscribe();
  return (
    <div className="flex items-center gap-5">
      <Input
        className="email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <div className="btn-primary" onClick={subscribe}>
        Subscribe
      </div>
    </div>
  );
}

function SectionHero() {
  const { day, hour, minute, second } = useCountDate(TGE_TIME);
  return (
    <div className="section section-hero">
      <div className="launchbox-container">
        <div className="launchbox-title">Launch in ...</div>
        <div className="launchbox-countdown-container">
          {[
            {
              value: day,
              label: "DAYS",
            },
            {
              value: hour,
              label: "HOURS",
            },
            {
              value: minute,
              label: "MINUTES",
            },
            {
              value: second,
              label: "SECONDS",
            },
          ].map(({ value, label }, idx) => (
            <React.Fragment key={label}>
              {idx !== 0 && <div className="launchbox-countdown-divider">:</div>}
              <div className="launchbox-countdown-item">
                <div className="launchbox-countdown-item-value">{value}</div>
                <div className="launchbox-countdown-item-label">{label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="hero-container">
        <img src={ApusLogo} className="hero-logo" />
        <div className="hero-title">Enabling Verifiable Decentralized AI through Deterministic GPU Computing</div>
        <div className="hero-more-container">
          <Email />
          <SocialMediaList />
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: ImgHomepage.Feature1,
    title: "Verifiable Decentralized AI Inference",
    description:
      "Apus Network introduces Fast Provable Inference Faults(FPIF) to combine deterministic computations, cryptographic attestations, and economic incentives for fast, secure, and inexpensive verification.",
    link: "https://r2krpzvyn24gq75rtedeo56vpiyxvcya2xsntoeaz7ursparocea.arweave.net/jpUX5rhuuGh_sZkGR3fVejF6iwDV5Nm4gM_pGTwRcIg",
  },
  {
    icon: ImgHomepage.Feature2,
    title: "100% Community Launch",
    description:
      "$APUS, with a fixed 1 billion supply and deflationary mechanisms, ensures long-term value through fair, decentralized distribution with no pre-allocation for the team or early investors.",
    link: "https://3csodbzc3eweix6qkukrbfzr42v3stx7rh6xpg5vlkebap4p6eza.arweave.net/2KThhyLZLERf0FUVEJcx5qu5Tv-J_XebtVqIED-P8TI",
  },
  {
    icon: ImgHomepage.Feature3,
    title: "Competitive Incentive for AI Models",
    description:
      "Apus Network's economic model competitively incentivizes the development and execution of the top-tier AI models, aligning computational integrity with community-driven rewards.",
    link: "https://r2krpzvyn24gq75rtedeo56vpiyxvcya2xsntoeaz7ursparocea.arweave.net/jpUX5rhuuGh_sZkGR3fVejF6iwDV5Nm4gM_pGTwRcIg",
  },
];
function SectionFeatures() {
  return (
    <div className="section section-features">
      <div className="section-title">KEY Features</div>
      <div className="section-description md:max-w-[768px]">
        Apus Network is building towards a decentralized, trustless GPU network dedicated to empowering verifiable deAI
        inference through deterministic GPU computing.
      </div>
      <ul className="section-features-list">
        {features.map(({ icon, title, description, link }) => (
          <li className="section-features-item">
            <img src={icon} className="section-features-item-icon" />
            <div className="section-features-item-title">{title}</div>
            <div className="section-features-item-description">{description}</div>
            <Link to={link} className="section-features-item-link" target="_blank">
              <div className="btn-primary">Learn More</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function SectionTech() {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";

  return (
    <div className="section section-tech">
      <div className="section-divider px-5 md:px-0"></div>
      <div className="section-title px-5 md:px-0">How It Works</div>
      <div className="section-description px-5">
        Apus Network leverages deterministic GPU computation and the Fast Provable Inference Faults (FPIF) protocol to
        ensure computational integrity and efficiency. Integrated with Arweave’s immutable storage and AO’s trustless
        infrastructure, it prevents unauthorized model manipulation and maintains tamper-proof records, enabling
        cost-effective AI inference
      </div>
      <img src={isTablet ? ImgHomepage.TechMobile : ImgHomepage.Tech} className="mt-10 md:my-10 px-5 md:px-0" />
      <div className="px-5 md:px-0 text-gray21 font-semibold md:text-[40px]">Verifiable AI Inference</div>
      <div className="m-2 md:m-0 md:my-5 px-5 md:px-0 text-gray21 text-[10px] md:text-[26px] leading-none">
        Introduction
      </div>
      <TwitterVideo className="md:mb-4" videoID="-rPbCeCbJVc?si=778KTA2eKneoQLDF" />
      <div className="m-2 md:m-0 md:mb-5 px-5 md:px-0 text-gray21 text-[10px] md:text-[26px] leading-none">
        Technology
      </div>
      <TwitterVideo className="md:mb-4" videoID="m-TPFEfegM0?si=kqr5eAJVI5VA0Nqf" />
      <div className="m-2 md:m-0 md:mb-5 px-5 md:px-0 text-gray21 text-[10px] md:text-[26px] leading-none">
        Tokenomics
      </div>
      <TwitterVideo className="mb-10" videoID="nMl9iW9WPt8?si=7zrmAW_bNczyQXbd" />
    </div>
  );
}

function SectionRoadmap() {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";
  return (
    <div className="section section-roadmap">
      <div className="section-divider"></div>
      <div className="section-title">Roadmap</div>
      <div className="section-description md:px-[100px]">
        To achieve the seamless integration and enhancement of Fast Provable Inference Faults (FPIF ML) within the AO
        Protocol and Arweave ecosystem, Apus Network has outlined a comprehensive roadmap. This roadmap details the
        phased development and implementation milestones from Q4 2024 through Q3 2025.
      </div>
      <img src={isTablet ? ImgHomepage.RoadmapMobile : ImgHomepage.Roadmap} className="my-10" />
    </div>
  );
}

const PoweredBy = [
  {
    icon: ImgHomepage.LogoAO,
    height: 40,
  },
  {
    icon: ImgHomepage.LogoArweave,
    height: 41,
  },
  {
    icon: ImgHomepage.LogoArio,
    height: 71,
  },
];

function SectionPartners() {
  const breakpoint = useBreakpoint();
  const isTablet = breakpoint === "mobile";
  return (
    <div className="section section-partners">
      {isTablet && <div className="section-divider mb-10"></div>}
      <div className="section-title mb-10">Powered by</div>
      <div className="section-powered-list mb-10 md:mt-[100px] md:mb-[150px]">
        {PoweredBy.map(({ icon, height }) => (
          <div className="section-powered-item" key={icon}>
            <img src={icon} style={{ height: height * (isTablet ? 0.625 : 1) }} />
          </div>
        ))}
      </div>
      <div className="section-divider"></div>
      <div className="section-title mb-10">Partners</div>
      <div className="section-partner-list">
        {partners.map(({ Logo, height }) => (
          <img src={Logo} style={{ height: height * (isTablet ? 0.73 : 1) }} />
        ))}
      </div>
      <div className="section-divider"></div>
      <div className="text-gray21 text-[35px] md:text-[50px] text-center leading-none mb-2 md:mb-4">
        Stay Up to Date - Subscribe Now
      </div>
      <div className="text-gray21 text-sm md:text-[26px] text-center mb-8 md:mb-10">
        Follow us on our social media or subscribe to our email newsletter to get the latest updates
      </div>
      <Email />
      <SocialMediaList className="my-10 md:mb-0" />
    </div>
  );
}

export default function HomeIndex() {
  return (
    <div id="homepage">
      <SectionHero />
      <SectionFeatures />
      <SectionTech />
      <SectionRoadmap />
      <SectionPartners />
    </div>
  );
}
