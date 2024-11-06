import { FC } from "react";
import { useArweaveContext } from "../../../contexts/arconnect";
import { useCompetitionPool } from "../../../contexts/competition";
import { Spin, message } from "antd";

export const QuickButton: FC<{
  disabled: boolean;
  text: string;
  loading: boolean;
  checkPermission: ReturnType<typeof useCompetitionPool>["checkPermission"];
  onJoinCompetition: () => void;
}> = ({ text, disabled, checkPermission, loading, onJoinCompetition }) => {
  const { activeAddress, connectWallet } = useArweaveContext();
  return (
    <Spin spinning={loading}>
      <div
        className={`btn-blueToPink135 ${disabled ? "disabled" : " cursor-pointer"}`}
        onClick={async () => {
          if (!activeAddress) {
            connectWallet();
          } else {
            const result = await checkPermission({
              FromAddress: activeAddress,
            });
            if (result?.Messages?.[0]?.Data) {
              onJoinCompetition();
            } else {
              message.warning("You need to be whitelisted. Follow @apus_network on X for information.");
            }
          }
        }}
      >
        {activeAddress ? text : "Connect Wallet"}
      </div>
    </Spin>
  );
};
