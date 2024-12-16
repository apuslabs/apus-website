import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { createBreakpoint } from "react-use";

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

  return { day, hour, minute, second, duration: dayjs.duration(diff, "seconds").humanize() };
}
