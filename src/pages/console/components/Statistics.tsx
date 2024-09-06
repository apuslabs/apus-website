import { Dashboard } from "../../../contexts/competition";
import { formatNumber } from "../../../utils/utils";

const DefaultDash = (val: number, suffix?: string): string =>
  val === -1 ? "-" : formatNumber(val) + (suffix != null ? ` ${suffix}` : "");

export const Statisitcs = ({
  participants,
  granted_reward,
  rank,
  rewarded_tokens,
}: Dashboard) => [
  {
    label: "Total Participants",
    value: DefaultDash(participants || 0),
  },
  {
    label: "Rewards Distributed",
    value: DefaultDash(granted_reward || 0, "APUS_Tn1"),
  },
  {
    label: "Your Rank",
    value: DefaultDash(rank || 0),
  },
  {
    label: "Your APUS_Tn1",
    value: DefaultDash(rewarded_tokens || 0, "APUS_Tn1"),
  },
];
