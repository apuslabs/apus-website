import { Dashboard } from "../../../contexts/competition";
import { formatNumber } from "../../../utils/utils";

const DefaultDash = (val: number, suffix?: string): string =>
  val === -1 ? "-" : (formatNumber(val) + (suffix != null ? ` ${suffix}` : ""));

export const Statisitcs = ({
  participants,
  granted_reward,
  my_rank,
  my_reward,
}: Dashboard) => [
  {
    label: "Total Participants",
    value: DefaultDash(participants),
  },
  {
    label: "Rewards Distributed",
    value: DefaultDash(granted_reward, "Points"),
  },
  {
    label: "Your Rank",
    value: DefaultDash(my_rank),
  },
  {
    label: "Your Points",
    value: DefaultDash(my_reward, "Points"),
  },
];
