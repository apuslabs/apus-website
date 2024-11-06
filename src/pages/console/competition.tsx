import { useEffect, useState } from "react";
import { ConfigProvider, Table } from "antd";
import "./competition.css";
import { useCompetitionPool } from "../../contexts/competition";
import { QuickButton } from "./components/QuickButton";
import { ButtonShowMore } from "./components/ButtonShowMore";
import { CompetitionDetails } from "./components/CompetitionDetails";
import { Statisitcs } from "./components/Statistics";
import { RenderEmpty, TableColumns } from "./const";
import { JoinCompetitionModal } from "./components/JoinCompetitionModal";
import { useArweaveContext } from "../../contexts/arconnect";
import SubmitSuccessfulModal from "./components/SubmitSuccessfulModal";
import { useParams } from "react-router-dom";

const TwitterVideo = ({ videoLink }: { videoLink?: string }) => {
  return videoLink ? (
    <iframe
      width="560"
      height="315"
      src={videoLink}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  ) : (
    <div></div>
  );
};

const Competition = () => {
  const { activeAddress } = useArweaveContext();
  const { poolid } = useParams();
  const [showMore, setShowMore] = useState(false);
  const [joinCompetitionModalVisible, setJoinCompetitionModalVisible] = useState(false);
  const [submitSuccessfulModalVisible, setSubmitSuccessfulModalVisible] = useState(false);

  const {
    dashboard,
    isPoolStarted,
    isQuickBtnDisabled,
    joinPool,
    checkPermission,
    checkingPermission,
    leaderboard,
    leaderboardLoading,
    poolInfo,
    quickBtnOnClick,
    quickBtnText,
    stage,
    timeTips,
  } = useCompetitionPool(poolid, () => {
    setSubmitSuccessfulModalVisible(true);
  });

  useEffect(() => {
    if (!isPoolStarted) {
      setShowMore(true);
    }
  }, [isPoolStarted]);

  return (
    <div id="competition" className="max-w-[1080px] mx-auto pb-64">
      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Competition Pool</h2>
        <QuickButton
          text={quickBtnText}
          disabled={isQuickBtnDisabled}
          loading={checkingPermission}
          checkPermission={checkPermission}
          onJoinCompetition={() => quickBtnOnClick(setJoinCompetitionModalVisible)}
        />
      </div>
      <div className="relative p-6 bg-light rounded-2xl">
        <div className="w-3/5">
          <h1 className="mb-6 font-bold text-3xl leading-tight">{poolInfo.title || ""}</h1>
          <p className=" text-neutral-900 leading-none">{timeTips}</p>
        </div>
        <ButtonShowMore open={showMore} onClick={() => setShowMore((n) => !n)} />
        <div className={`mt-6 justify-between ${showMore ? "flex" : "hidden"}`}>
          <ul className="flex flex-col gap-4 w-3/5">
            {CompetitionDetails(poolInfo, stage).map(({ icon, label, value, detail }) => {
              return (
                <li className="text-sm" key={label}>
                  <div className="flex items-center gap-1">
                    <img src={icon} className="w-4 h-4" />
                    <span className="text-black">{label}:</span>
                    {value && <span className="text-black50">{value}</span>}
                  </div>
                  {detail && (
                    <p
                      className="mt-2 text-black50 px-5 leading-relaxed text-wrap break-words whitespace-pre-wrap detail_inject_content"
                      dangerouslySetInnerHTML={{ __html: detail }}
                    ></p>
                  )}
                </li>
              );
            })}
          </ul>
          <TwitterVideo videoLink={poolInfo.metadata.video} />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Dashboard</h2>
      </div>
      <div className="flex gap-4">
        {Statisitcs(dashboard).map(({ label, value }) => {
          return (
            <div className="flex-1 bg-light p-6 border border-black5 border-solid rounded-2xl" key={label}>
              <label className="text-black50 text-xs mb-4">{label}</label>
              <div className="font-medium text-xl">{value}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col mt-8 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Leaderboard</h2>
        <p className="mt-2 text-black50 text-xs">Leaderboard updated every 1 hours</p>
      </div>
      <div className="rounded-2xl">
        <ConfigProvider renderEmpty={RenderEmpty}>
          <Table
            dataSource={leaderboard}
            rowKey="dataset_hash"
            loading={leaderboardLoading}
            columns={TableColumns(poolid, activeAddress)}
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
      <SubmitSuccessfulModal
        visible={submitSuccessfulModalVisible}
        onCancel={() => {
          setSubmitSuccessfulModalVisible(false);
        }}
      />
    </div>
  );
};

export default function CompetitionWrapper() {
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
}
