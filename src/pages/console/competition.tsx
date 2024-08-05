import { useState } from "react";
import { ImgCompetition } from "../../assets/image";
import { ConfigProvider, Empty, Form, GetProp, Input, Modal, Table, Tooltip } from "antd";
import "./competition.css";
import {
  useCompetitionPool,
} from "../../contexts/competition";
import { QuickButton } from "./components/QuickButton";
import { ButtonShowMore } from "./components/ButtonShowMore";
import { CompetitionDetails } from "./components/CompetitionDetails";
import { Statisitcs } from "./components/Statistics";
import { renderEmpty, TableColumns } from "./const";
import { JoinCompetitionModal } from "./components/JoinCompetitionModal";

const TwitterVideo = () => (
  <iframe
    className="w-[22.25rem] h-[12.5rem] rounded-lg"
    src="https://www.youtube.com/embed/-rPbCeCbJVc?si=778KTA2eKneoQLDF"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  ></iframe>
);

const Competition = () => {
  const [showMore, setShowMore] = useState(false);
  const [joinCompetitionModalVisible, setJoinCompetitionModalVisible] =
    useState(false);

  const {
    poolInfo,
    poolInfoLoading,
    dashboard,
    // dashboardLoading,
    leaderboard,
    leaderboardLoading,
    joinPoolResult,
    joinPoolLoading,
    joinPoolError,
    joinPool,
    isPoolStarted,
    isPoolEnded,
    poolOpening,
    quickBtnText,
    quickBtnOnClick,
    timeTips,
    stage,
  } = useCompetitionPool(setJoinCompetitionModalVisible, setShowMore);

  if (poolInfoLoading) {
    return <div></div>;
  }

  return (
    <div id="competition" className="max-w-[1080px] mx-auto pb-64">
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">
          Competition Pool
        </h2>
        <QuickButton
          text={quickBtnText}
          disabled={!isPoolStarted || isPoolEnded}
          onJoinCompetition={quickBtnOnClick}
        />
      </div>
      <div className="relative p-6 bg-light rounded-2xl">
        <div className="w-3/5">
          <h1 className="mb-6 font-bold text-3xl leading-tight">
            {poolInfo.title ||
              "Fine-tune AI model_Conversations On Coding, Debugging, Storytelling"}
          </h1>
          <p className=" text-neutral-900 leading-none">{timeTips}</p>
        </div>
        <ButtonShowMore
          open={showMore}
          onClick={() => setShowMore((n) => !n)}
        />
        <div className={`mt-6 justify-between ${showMore ? "flex" : "hidden"}`}>
          <ul className="flex flex-col gap-4 w-3/5">
            {CompetitionDetails(poolInfo, stage).map(
              ({ icon, label, value }) => {
                return (
                  <li className="flex items-center gap-1 text-sm" key={label}>
                    <img src={icon} className="w-4 h-4" />
                    <span className="text-black">{label}:</span>
                    <span className="text-black50">{value}</span>
                  </li>
                );
              }
            )}
            <li className="text-sm">
              <div className="flex items-center gap-1 mb-3">
                <img src={ImgCompetition.IconAlignLeft} className="w-4 h-4" />
                <span className="text-black">Requirements:</span>
              </div>
              <p className="text-black50 px-5 leading-relaxed">
                {poolInfo.description ||
                  `Large language models (LLMs) are rapidly entering our lives, but
                ensuring their responses resonate with users is critical for
                successful interaction. This competition presents a unique
                opportunity to tackle this challenge with real-world data and
                help us bridge the gap between LLM capability and human
                preference.`}
              </p>
            </li>
          </ul>
          <TwitterVideo />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Dashboard</h2>
      </div>
      <div className="flex gap-4">
        {Statisitcs(dashboard).map(({ label, value }) => {
          return (
            <div
              className="flex-1 bg-light p-6 
            border border-black5 border-solid rounded-2xl"
              key={label}
            >
              <label className="text-black50 text-xs mb-4">{label}</label>
              <div className="font-medium text-xl">{value}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Leaderboard</h2>
        <p className="mt-2 text-black50 text-xs">
          Leaderboard updated every 24 hours
        </p>
      </div>
      <div className="rounded-2xl">
        <ConfigProvider renderEmpty={renderEmpty}>
        <Table
          dataSource={[]}
          rowKey="dataset_id"
          loading={leaderboardLoading}
          columns={TableColumns}
          
        />
        </ConfigProvider>
      </div>
      <JoinCompetitionModal
        visible={joinCompetitionModalVisible}
        onCancel={() => {
          setJoinCompetitionModalVisible(false);
        }}
        onOk={() => {
          setJoinCompetitionModalVisible(true);
        }}
      />
    </div>
  );
};

export default () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "transparent",
        },
        components: {
          Table: {
            headerBg: "rgba(6,45,250,0.1)",
            rowHoverBg: "rgba(6,45,250,0.1)",
          },
          Pagination: {
            itemActiveBg: "#061EFA",
          },
          Input: {
            paddingBlockLG: 15,
            paddingInlineLG: 16,
            borderRadiusLG: 8,
          },
        },
      }}
    >
      <Competition />
    </ConfigProvider>
  );
};
