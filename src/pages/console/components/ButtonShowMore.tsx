import { FC } from "react";
import { ImgCompetition } from "../../../assets/image";

export const ButtonShowMore: FC<{
  open: boolean;
  onClick: () => void;
}> = ({ open, onClick }) => {
  return (
    <div
      className=" absolute right-6 top-6
    btn-default flex items-center gap-2"
      onClick={onClick}
    >
      Show {open ? "Less" : "More"}{" "}
      <img src={ImgCompetition.ChevronDown} className={`w-3 h-3 ${open ? "rotate-180" : ""}`} />
    </div>
  );
};
