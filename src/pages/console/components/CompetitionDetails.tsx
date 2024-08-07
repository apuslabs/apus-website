import { Tooltip } from "antd";
import { ImgCompetition } from "../../../assets/image";
import { PoolInfo } from "../../../contexts/competition";
import { formatNumberWithSuffix, timeFormat } from "../../../utils/utils";
import { Link } from "react-router-dom";

export const CompetitionDetails = (poolInfo: PoolInfo, stage: string) => [
  {
    icon: ImgCompetition.IconCoinsStacked,
    label: "Reward Pool",
    value: (
      <div className="flex items-center gap-1">
        <span className="text-gradient2 font-medium">
          {(formatNumberWithSuffix(poolInfo.prize_pool) || "0") + " Points"}
        </span>
        <Tooltip
          title="50% of the reward pool is allocated to the top three participants in the leaderboards."
          overlayInnerStyle={{
            width: "20rem",
          }}
        >
          <img src={ImgCompetition.IconInfoCircle} className="w-4 h-4" />
        </Tooltip>
      </div>
    ),
  },
  {
    icon: ImgCompetition.IconCalendar,
    label: "Duration",
    value:
      timeFormat(poolInfo.meta_data.competition_time.start) +
      " - " +
      timeFormat(poolInfo.meta_data.competition_time.end),
  },
  {
    icon: ImgCompetition.IconHourGlass,
    label: "Stage",
    value: stage,
  },
  // {
  //   icon: ImgCompetition.IconFile,
  //   label: "Fine-tuning Tutorial",
  //   value: (
  //     <Link to="/" className=" text-blue font-medium">
  //       {poolInfo.fine_tuning_tutorial_link || "https://github.com"}
  //     </Link>
  //   ),
  // },
  {
    icon: ImgCompetition.IconData,
    label: "Dataset",
    value: (
      <Link to="https://github.com/apuslabs/Dataset-Sample" className="text-blue font-medium">
        {"https://github.com/apuslabs/Dataset-Sample"}
      </Link>
    ),
  },
];