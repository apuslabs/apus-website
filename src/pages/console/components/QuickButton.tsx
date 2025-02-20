import { FC } from "react";
import { useCompetitionPool } from "../../../contexts/competition";
import { Spin, message } from "antd";
import { useActiveAddress, useConnection } from "arweave-wallet-kit";

export const QuickButton: FC<{
  disabled: boolean;
  text: string;
  loading: boolean;
  checkPermission: ReturnType<typeof useCompetitionPool>["checkPermission"];
  onJoinCompetition: () => void;
}> = ({ text, disabled, checkPermission, loading, onJoinCompetition }) => {
  const activeAddress = useActiveAddress();
  const {connect} = useConnection()
  return (
    <Spin spinning={loading}>
      <div
        className={`btn-blueToPink135 ${disabled ? "disabled" : " cursor-pointer"}`}
        onClick={async () => {
          if (!activeAddress) {
            connect();
          } else if (!disabled) {
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
