import { useEffect, useRef } from "react";
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
