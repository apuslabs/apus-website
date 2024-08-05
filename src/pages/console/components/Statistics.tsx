import { Dashboard } from "../../../contexts/competition";
import { formatNumber } from "../../../utils/utils";

export const Statisitcs = ({
  participants,
  granted_reward,
  my_rank,
  my_reward,
}: Dashboard) => [
  {
    label: "Total Participants",
    value: formatNumber(participants),
  },
  {
    label: "Rewards Distributed",
    value: formatNumber(granted_reward) + " Points",
  },
  {
    label: "Your Rank",
    value: my_rank,
  },
  {
    label: "Your Points",
    value: formatNumber(my_reward) + " Points",
  },
];