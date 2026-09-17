import { useEffect, useRef } from "react";
import { useBoardStore } from "../store/board";
import { mondayOf, todayStr } from "../utils/date";

const CHECK_INTERVAL = 60_000;

export function useMidnightRefresh(): void {
  const lastDayRef = useRef(todayStr());

  useEffect(() => {
    const id = window.setInterval(() => {
      const current = todayStr();
      if (current === lastDayRef.current) return;
      const { viewDate } = useBoardStore.getState();
      if (viewDate === lastDayRef.current) {
        useBoardStore.setState({ viewDate: current, viewWeek: mondayOf(current) });
      }
      lastDayRef.current = current;
    }, CHECK_INTERVAL);
    return () => window.clearInterval(id);
  }, []);
}
