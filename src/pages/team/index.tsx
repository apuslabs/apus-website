import { Link } from "react-router-dom";
import { TeamMemebers } from "./constants";
import { ImgTeam } from "../../assets";
const { IconLinkedIn } = ImgTeam;

export default function Team() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-gray33 text-6xl font-bold mt-40 mb-16">Team</div>
      <div
        className="grid grid-cols-1 grid-rows-6 md:grid-cols-3 md:grid-rows-2 gap-10
        text-white leading-none mb-[4.25rem]"
      >
        {TeamMemebers.map(({ name, role, avatar, linkedin }) => {
          return (
            <div
              key={name}
              className="w-[23.75rem] h-[28.125rem] rounded-[2.375rem] bg-gray33 pt-8
              flex flex-col items-center
              hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <img src={avatar} alt={name} className="w-[16.875rem] h-[16.875rem] rounded-3xl" />
              <div className="font-bold text-[2rem] mt-3">{name}</div>
              <div className="font-medium text-2xl">{role}</div>
              {linkedin && (
                <Link to={linkedin}>
                  <img src={IconLinkedIn} className="mt-[1.125rem] w-[1.875rem] h-[1.875rem]" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
