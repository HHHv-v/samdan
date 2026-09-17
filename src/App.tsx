import { useState } from "react";
import BackupDialog from "./components/common/BackupDialog";
import DailyColumn from "./components/daily/DailyColumn";
import MemoColumn from "./components/memo/MemoColumn";
import WeeklyColumn from "./components/weekly/WeeklyColumn";
import { useAutoHide } from "./hooks/useAutoHide";
import { useMidnightRefresh } from "./hooks/useMidnightRefresh";

const GRID_COLS = "grid-cols-[minmax(300px,1fr)_minmax(340px,1fr)_minmax(300px,0.85fr)]";

export default function App() {
  const [backupOpen, setBackupOpen] = useState(false);
  const { hidden, show, handleMouseEnter, handleMouseLeave } = useAutoHide(backupOpen);
  useMidnightRefresh();

  function openBackup() {
    setBackupOpen(true);
    show();
  }

  function closeBackup() {
    setBackupOpen(false);
    show();
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div onMouseEnter={show} className="fixed inset-x-0 top-0 z-10 h-2.5" aria-hidden="true" />

      <header
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={show}
        className={`grid flex-none overflow-hidden ${GRID_COLS} transition-[height,opacity] duration-300 ${
          hidden ? "h-0 opacity-0" : "h-[60px] opacity-100"
        }`}
      >
        <div
          className="flex items-center px-7"
          style={{ backgroundColor: "color-mix(in oklch, var(--color-dark), white 55%)" }}
        >
          <h1 className="text-[22px] font-extrabold tracking-tight text-deep">SAMDAN</h1>
        </div>
        <div style={{ backgroundColor: "color-mix(in oklch, var(--color-mid), white 55%)" }} />
        <div className="flex items-center justify-end bg-pale px-7 text-dark">
          <button
            type="button"
            onClick={openBackup}
            className="rounded-full border border-dark/20 px-3.5 py-1 text-[13px] hover:border-dark"
          >
            백업 / 복원
          </button>
        </div>
      </header>

      <main className={`grid min-h-0 flex-1 ${GRID_COLS}`}>
        <WeeklyColumn />
        <DailyColumn />
        <MemoColumn />
      </main>

      <BackupDialog open={backupOpen} onClose={closeBackup} />
    </div>
  );
}
