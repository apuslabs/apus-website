import { Card } from "antd";
import { getDataFromMessage, useAO } from "../../utils/ao";
import { POOL_PROCESS } from "../../utils/config";
import { useLayoutEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface PoolInfoMetadata {
  description: string;
  dataset: string;
  video: string;
  duration_desc?: string;
}

interface Pool {
  pool_id: number;
  title: string;
  reward_pool: number;
  start_time: number;
  end_time: number;
  metadata: PoolInfoMetadata;
}

function CompetitionCard({ pool_id, title, reward_pool, start_time, end_time }: Pool) {
  const navigate = useNavigate();
  return (
    <Card>
      <div className="font-medium text-xl leading-none mb-4">{title}</div>
      <div className="mb-12 text-xs text-black50">
        Duration: {dayjs.unix(start_time).format("YYYY.MM.DD HH:mm")} -{" "}
        {dayjs.unix(end_time).format("YYYY.MM.DD HH:mm")}
      </div>
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <div className="text-xs text-black50 mb-2">Reward</div>
          <div className="font-medium text-blue">{reward_pool} APUS</div>
        </div>
        <div
          className="btn-blueToPink135"
          style={{
            width: "6rem",
          }}
          onClick={() => {
            navigate(`/console/competition/${pool_id}`);
          }}
        >
          Bid
        </div>
      </div>
    </Card>
  );
}

export function Component() {
  const { result: competitionsResult, execute: getCompetitions } = useAO(POOL_PROCESS, "Get-Competitions", "dryrun");
  useLayoutEffect(() => {
    getCompetitions();
  }, [getCompetitions]);
  const competitions: Pool[] = JSON.parse(getDataFromMessage<string>(competitionsResult) || "[]");
  // console.log(typeof competitions);
  const activeCompetitions = competitions?.filter(
    (c) => c.start_time < Date.now() / 1000 && c.end_time > Date.now() / 1000,
  );
  const upcomingCompetitions = competitions?.filter((c) => c.start_time > Date.now() / 1000);
  const pastCompetitions = competitions?.filter((c) => c.end_time < Date.now() / 1000);
  return (
    <div className="max-w-[80rem] mx-auto p-6">
      {[
        {
          label: "Active",
          labelColorTag: "bg-[#3EDCBF]",
          competitions: activeCompetitions,
        },
        {
          label: "Upcoming",
          labelColorTag: "bg-[#061EFA]",
          competitions: upcomingCompetitions,
        },
        {
          label: "Expired",
          labelColorTag: "bg-[#aaaaaa]",
          competitions: pastCompetitions,
        },
      ]
        .filter(({ competitions }) => competitions?.length)
        .map(({ label, labelColorTag, competitions }) => {
          return (
            <div key={label}>
              <div className="text-sm text-black50 mb-4">
                <span className={`inline-block w-2 h-2 ${labelColorTag} rounded`}></span> {label}
              </div>
              <div className="grid grid-flow-row grid-cols-3 gap-4 mb-4">
                {competitions?.map((c) => <CompetitionCard key={c.title} {...c} />)}
              </div>
            </div>
          );
        })}
    </div>
  );
}
