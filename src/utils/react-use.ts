import dayjs from "dayjs";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createBreakpoint } from "react-use";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const useBreakpoint = createBreakpoint({ desktop: 768, mobile: 350 });

export function useAutoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });

  return containerRef;
}

export function useAnchor() {
  const scrollToAnchor = useCallback((anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  useLayoutEffect(() => {
    const realpath = window.location.hash.replace("#", "").split("?")[1];
    const params = new URLSearchParams(realpath);
    const anchor = params.get("anchor");
    if (anchor) {
      scrollToAnchor(anchor);
    }
  }, [scrollToAnchor]);
}

export function useCountDate(date: dayjs.Dayjs) {
  const [diff, setDiff] = useState(0);
  const day = useMemo(() => Math.floor(diff / 86400), [diff]);
  const hour = useMemo(() => Math.floor((diff % 86400) / 3600), [diff]);
  const minute = useMemo(() => Math.floor((diff % 3600) / 60), [diff]);
  const second = useMemo(() => Math.floor(diff % 60), [diff]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const target = dayjs(date);
      const diff = target.diff(now, "second");
      setDiff(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  const leftTimeStr = `${day > 0 ? day + "d" : ""} ${hour > 0 ? hour + "h" : ""} ${minute > 0 ? minute + "m" : ""} ${second > 0 ? second + "s" : ""}`;

  return { day, hour, minute, second, leftTimeStr, duration: dayjs.duration(diff, "seconds").humanize() };
}
