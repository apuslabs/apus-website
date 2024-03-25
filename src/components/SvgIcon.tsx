import React, { FC } from "react";

interface IconProps {
  name: string;
  size?: string | number;
  color?: string;
}

export const Icon: FC<IconProps> = (props) => {
  const { name, size, color } = props;

  const SvgIcon = React.cloneElement(SvgList[name], {
    width: size,
    height: size,
    fill: color,
  });

  return <>{SvgIcon}</>;
};

Icon.defaultProps = {
  size: 20,
  color: "#000",
};

const SvgList: Record<string, JSX.Element> = {
  Square: (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.5 3h-7A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3m-7-1.5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3z"
        fillRule="evenodd"
      />
    </svg>
  ),
  Widescreen: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 416h440a20.023 20.023 0 0 0 20-20V116a20.023 20.023 0 0 0-20-20H36a20.023 20.023 0 0 0-20 20v280a20.023 20.023 0 0 0 20 20Zm12-288h416v256H48Z" />
    </svg>
  ),
  Mobile: (
    <svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-10ZM4.5 1A1.5 1.5 0 0 0 3 2.5v10A1.5 1.5 0 0 0 4.5 14h6a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 10.5 1h-6ZM6 11.65a.35.35 0 1 0 0 .7h3a.35.35 0 1 0 0-.7H6Z"
        fillRule="evenodd"
      />
    </svg>
  ),
  Landscape: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M36 416h440a20.023 20.023 0 0 0 20-20V116a20.023 20.023 0 0 0-20-20H36a20.023 20.023 0 0 0-20 20v280a20.023 20.023 0 0 0 20 20Zm12-288h416v256H48Z" />
    </svg>
  ),
  Portrait: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 22H6q-.825 0-1.413-.588T4 20V4q0-.825.588-1.413T6 2h12q.825 0 1.413.588T20 4v16q0 .825-.588 1.413T18 22ZM6 20h12V4H6v16Zm0 0V4v16Z" />
    </svg>
  ),
  Check: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376 384">
      <path d="M119 282L346 55l29 30l-256 256L0 222l30-30z" />
    </svg>
  ),
  Down: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M36 18L24 30L12 18"
      />
    </svg>
  ),
};
