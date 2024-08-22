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
          {/* {(formatNumberWithSuffix(poolInfo.prize_pool) || "0") + " APUS_Tn1"} */}
          157000 APUS_Tn1
        </span>
        <Tooltip
          title="The 157,000 APUS_Tn1 prize pool is distributed as follows: 1st place receives 35,000, 2nd place 20,000, 3rd place 10,000, 4th to 10th places 5,000 each, and 300 APUS_Tn1 for all other qualified participants. Only the top 200 participants are eligible for rewards."
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
  {
    icon: ImgCompetition.IconData,
    label: "Dataset",
    value: (
      <Link to="https://github.com/apuslabs/Dataset-Sample" className="text-blue font-medium">
        {"https://github.com/apuslabs/Dataset-Sample"}
      </Link>
    ),
  },
  {
    icon: ImgCompetition.IconFile,
    label: "FAQ",
    value: (
      <Link to="/" className=" text-blue font-medium">
        {"https://medium.com/@apusnetwork/apus-network-faq-ac0b57614f86"}
      </Link>
    ),
  },
];