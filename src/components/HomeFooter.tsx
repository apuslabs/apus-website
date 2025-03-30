import { ImgHomepage } from "../assets";
import { Link } from "react-router-dom";
import { SocialMediaList } from "./SocialMediaList";
import { FeedbackFish } from "@feedback-fish/react";
import { useState } from "react";
import { Input, message } from "antd";
import { TokenomicsDocLink } from "./constants";

const MenuList = {
  MAIN: [
    { name: "Team", path: "/team" },
    { name: "Mint", path: "/mint" },
    { name: "Roadmap", path: "/?anchor=roadmap" },
  ],
  RESOURCES: [
    { name: "Blog", path: "https://mirror.xyz/0xE84A501212d68Ec386CAdAA91AF70D8dAF795C72" },
    {
      name: "Litepaper",
      path: "https://r2krpzvyn24gq75rtedeo56vpiyxvcya2xsntoeaz7ursparocea.arweave.net/jpUX5rhuuGh_sZkGR3fVejF6iwDV5Nm4gM_pGTwRcIg",
    },
    {
      name: "Tokenomics",
      path: TokenomicsDocLink,
    },
  ],
  COMPANY: [
    {
      name: "Branding",
      path: "https://apusnetwork.notion.site/c8a7f84bf0814822b917cd3178fe048c?v=e95ed9ee42cd4bf6983490181969fc79&pvs=4",
    },
  ],
};

function useSubscribe() {
  const [email, setEmail] = useState("");
  const subscribe = () => {
    // check email value if null and email
    if (!email || !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      message.error("Invalid Email!");
      return;
    }
    const formData = new FormData();
    formData.append("entry.634050656", email);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLScil1B1VTKLFBrmroSfxhp0PtoQIa1SOHl7jH6kTCoAWS_L2A/formResponse", {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        message.success("Subscribe Successfully!");
        setEmail("");
      })
      .catch((error) => {
        message.error("Subscribe Failed!");
        console.error("Subscribe Failed", error);
      });
  };
  return {
    email,
    setEmail,
    subscribe,
  };
}

function Email() {
  const { email, setEmail, subscribe } = useSubscribe();
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
      <Input
        size="large"
        style={{
          height: "48px",
        }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <div className="px-5 h-[42px] md:h-[48px] leading-[42px] md:leading-[48px] bg-[#3242f5] text-white text-lg font-space-mono cursor-pointer rounded-lg hover:bg-[#1e30c9]" onClick={subscribe}>
        Subscribe
      </div>
    </div>
  );
}

function HomeFooter() {
  return (
    <div className="bg-white text-[#1b1b1b] text-sm md:text-[22px]">
      <div className="content-area pt-[50px] md:py-[128px]">
        <div className="flex flex-col md:flex-row md:justify-between gap-[50px]">
          <div className="flex flex-wrap py-[30px] px-[50px] md:p-0 md:mb-[120px] gap-[60px] md:gap-[100px] footer-nav order-2 md:order-1 border-[#d9d9d9] border-t-1 md:border-t-0 border-b-1 md:border-b-0">
            <div>
              <div className="mb-10 font-semibold">MAIN</div>
              <ul className="flex flex-col gap-6 md:list-disc md:pl-6">
                {MenuList.MAIN.map(({ name, path }) => (
                  <Link to={path} key={name}>
                    <li className="font-space-mono">{name}</li>
                  </Link>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-10 font-semibold">RESOURCES</div>
              <ul className="flex flex-col gap-6 md:list-disc md:pl-6">
                {MenuList.RESOURCES.map(({ name, path }) => (
                  <Link to={path} key={name} target="__blank">
                    <li className="font-space-mono">{name}</li>
                  </Link>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-10 font-semibold">COMPANY</div>
              <ul className="flex flex-col gap-6 md:list-disc md:pl-6">
                <FeedbackFish projectId="bbf0e91842cb41">
                  <li className="cursor-pointer font-space-mono">Feedback</li>
                </FeedbackFish>
                {MenuList.COMPANY.map(({ name, path }) => (
                  <Link to={path} key={name} target="__blank">
                    <li className="font-space-mono">{name}</li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[50px] md:gap-[76px] order-1 md:order-2">
            <Email />
            <SocialMediaList />
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start pt-[50px] pb-[100px] md:py-0">
          <img src={ImgHomepage.LogoHorizonal} className="h-[25px] md:h-[34px] w-[105px] md:w-[150px] mb-5" />
          <div className="text-[#979797] text-sm">
            Copyright © Apus.Network 2024. All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeFooter;
