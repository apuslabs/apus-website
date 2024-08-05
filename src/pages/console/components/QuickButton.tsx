import { FC } from "react";
import { useArweaveContext } from "../../../contexts/arconnect";

export const QuickButton: FC<{
  disabled: boolean;
  text: string;
  onJoinCompetition: () => void;
}> = ({ text, disabled, onJoinCompetition }) => {
  const { activeAddress, connectWallet } = useArweaveContext();
  return (
    <div
      className={`btn-gradient3 ${disabled ? "opacity-50" : ""}`}
      onClick={() => {
        if (!activeAddress) {
          connectWallet();
        } else {
          onJoinCompetition();
        }
      }}
    >
      {activeAddress ? text : "Connect Wallet"}
    </div>
  );
};