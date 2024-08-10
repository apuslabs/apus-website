import { useEffect, useState } from "react";
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
import { useArweaveContext } from "../../contexts/arconnect";

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
  const { activeAddress } = useArweaveContext()
  const [showMore, setShowMore] = useState(false);
  const [joinCompetitionModalVisible, setJoinCompetitionModalVisible] =
    useState(false);

  const {
    poolInfo,
    dashboard,
    leaderboard,
    leaderboardLoading,
    joinPool,
    getLeaderboard,
    isPoolStarted,
    poolOpening,
    hasSubmitted,
    quickBtnText,
    quickBtnOnClick,
    timeTips,
    stage,
  } = useCompetitionPool();

  useEffect(() => {
    if (!isPoolStarted) {
      setShowMore(true)
    }
  }, [isPoolStarted])

  return (
    <div id="competition" className="max-w-[1080px] mx-auto pb-64">
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">
          Competition Pool
        </h2>
        <QuickButton
          text={quickBtnText}
          disabled={!poolOpening || hasSubmitted}
          onJoinCompetition={() => quickBtnOnClick(setJoinCompetitionModalVisible)}
        />
      </div>
      <div className="relative p-6 bg-light rounded-2xl">
        <div className="w-3/5">
          <h1 className="mb-6 font-bold text-3xl leading-tight">
            {"Sam Digital Twin Dataset Competition Pool" || poolInfo.title || ""}
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
              <p className="text-black50 px-5 leading-relaxed text-wrap break-words whitespace-pre-line">
                {poolInfo.meta_data.description ||
                  `Objective:
                  The Sam Digital Twin Dataset Competition Pool aims to help Sam, the Founder and Inventor of Arweave and AO, create a comprehensive digital twin by collecting extensive data.

                  Rules:
                  1. Submit datasets related to Sam.
                  2. Evaluations are conducted automatically on AO.
                  3. Open to individuals and teams.
                  4. If scores are tied, earlier submissions rank higher.

                  Prize Distribution:
                  The 100,000 APUS_Tn1 prize pool is distributed as follows:
                  1st place: 35% (35,000 APUS_Tn1)
                  2nd place: 20% (20,000 APUS_Tn1)
                  3rd place: 10% (10,000 APUS_Tn1)
                  4th-10th places: 5% each (5,000 APUS_Tn1 each)
                  All other qualified participants: 300 APUS_Tn1 each`}
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
              className="flex-1 bg-light p-6 border border-black5 border-solid rounded-2xl"
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
          Leaderboard updated every 1 hours
        </p>
      </div>
      <div className="rounded-2xl">
        <ConfigProvider renderEmpty={renderEmpty}>
        <Table
          dataSource={leaderboard}
          rowKey="dataset_id"
          loading={leaderboardLoading}
          columns={TableColumns(activeAddress)}
        />
        </ConfigProvider>
      </div>
      <JoinCompetitionModal
        visible={joinCompetitionModalVisible}
        onCancel={() => {
          setJoinCompetitionModalVisible(false);
        }}
        onOk={() => {
          setJoinCompetitionModalVisible(false);
        }}
        joinPool={joinPool}
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
