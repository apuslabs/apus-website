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
          {(formatNumberWithSuffix(poolInfo.prize_pool) || "0") + " APUS_Tn1"}
        </span>
        <Tooltip
          title="The 100,000 APUS_Tn1 prize pool is allocated as follows: 1st place gets 35%, 2nd place 20%, 3rd place 10%, 4th-10th places 5% each, and 300 APUS_Tn1 for all other qualified participants."
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