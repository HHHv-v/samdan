import { useCallback, useEffect, useRef, useState } from "react";

const HIDE_DELAY = 3000;

export function useAutoHide(active: boolean) {
  const [hidden, setHidden] = useState(false);
  const hoveredRef = useRef(false);
  const activeRef = useRef(active);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const scheduleHide = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(function tick() {
      if (hoveredRef.current || activeRef.current) {
        timerRef.current = window.setTimeout(tick, HIDE_DELAY);
        return;
      }
      setHidden(true);
    }, HIDE_DELAY);
  }, []);

  const show = useCallback(() => {
    setHidden(false);
    scheduleHide();
  }, [scheduleHide]);

  const handleMouseEnter = useCallback(() => {
    hoveredRef.current = true;
    window.clearTimeout(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = false;
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    scheduleHide();
    return () => window.clearTimeout(timerRef.current);
  }, [scheduleHide]);

  return { hidden, show, handleMouseEnter, handleMouseLeave };
}
