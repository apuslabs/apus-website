import { TeamMemebers } from "./constants";

export function Component() {
  return (
    <div className="content-area pt-[80px] md:pt-[110px] flex flex-col items-center md:items-start">
      <div className=" text-black text-[50px] font-semibold mt-[60px] mb-[77px]">Meet the Team</div>
      <div
        className="w-full grid grid-cols-1 grid-rows-6 md:grid-cols-3 md:grid-rows-2 gap-10
        text-white leading-none mb-[4.25rem]"
      >
        {TeamMemebers.map(({ name, role, avatar }) => {
          return (
            <div
              key={name}
              className="flex flex-col items-center text-[#262626]"
            >
              <img src={avatar} alt={name} className="w-[300px] h-[300px] border-1 border-solid border-[#d9d9d9] rounded-2xl" />
              <div className="font-semibold text-[24px] my-[10px]">{name}</div>
              <div className="text-base">{role}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
