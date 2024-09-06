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
          {(formatNumberWithSuffix(poolInfo.reward_pool) || "0") + " APUS_Tn1"}
        </span>
      </div>
    ),
  },
  {
    icon: ImgCompetition.IconCalendar,
    label: "Duration",
    value:
      timeFormat(poolInfo.metadata.competition_time.start) +
      " - " +
      timeFormat(poolInfo.metadata.competition_time.end),
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
      <Link
        to="https://github.com/apuslabs/Dataset-Sample"
        className="text-blue font-medium"
      >
        {"https://github.com/apuslabs/Dataset-Sample"}
      </Link>
    ),
  },
  {
    icon: ImgCompetition.IconFile,
    label: "FAQ",
    value: (
      <Link
        to="https://medium.com/@apusnetwork/apus-network-faq-ac0b57614f86"
        className=" text-blue font-medium"
      >
        {"https://medium.com/@apusnetwork/apus-network-faq-ac0b57614f86"}
      </Link>
    ),
  },
];
