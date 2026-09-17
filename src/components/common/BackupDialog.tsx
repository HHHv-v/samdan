import { useEffect, useRef, useState } from "react";
import { parseBackupPayload, useBoardStore } from "../../store/board";
import type { BoardState } from "../../types/board";

type BackupDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function BackupDialog({ open, onClose }: BackupDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-[min(560px,92vw)] rounded-2xl bg-pale p-[22px] text-dark backdrop:bg-black/35"
    >
      {/* open이 바뀔 때마다 key를 바꿔 새로 마운트시켜, 열 때마다 최신 데이터로 초기화한다. */}
      <BackupDialogBody key={open ? "open" : "closed"} onClose={onClose} />
    </dialog>
  );
}

function BackupDialogBody({ onClose }: { onClose: () => void }) {
  const todos = useBoardStore((s) => s.todos);
  const memos = useBoardStore((s) => s.memos);
  const restoreBoard = useBoardStore((s) => s.restoreBoard);

  const [text, setText] = useState(() => JSON.stringify({ todos, memos }, null, 2));
  const [copyLabel, setCopyLabel] = useState("복사");
  const [pendingRestore, setPendingRestore] = useState<BoardState | null>(null);
  const [error, setError] = useState("");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("복사됨");
    } catch {
      setCopyLabel("Ctrl+C로 복사");
    }
    window.setTimeout(() => setCopyLabel("복사"), 1500);
  }

  function handleRestoreClick() {
    const parsed = parseBackupPayload(text);
    if (!parsed) {
      setError("백업 형식이 올바르지 않습니다. todos가 들어 있는 JSON을 붙여넣으세요.");
      return;
    }
    setError("");
    setPendingRestore(parsed);
  }

  function confirmRestore() {
    if (!pendingRestore) return;
    restoreBoard(pendingRestore);
    setPendingRestore(null);
    onClose();
  }

  return (
    <>
      <h3 className="mb-1.5 text-[17px] font-bold">백업 / 복원</h3>
      <p className="mb-3 text-[13px]">
        아래 내용을 복사해 두면 백업이 됩니다. 복원하려면 백업한 내용을 붙여넣고 복원을 누르세요. 복원하면 현재
        데이터를 덮어씁니다.
      </p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPendingRestore(null);
          setError("");
        }}
        spellCheck={false}
        className="h-[220px] w-full rounded-[10px] border border-mid bg-white p-2.5 font-mono text-xs text-dark"
      />
      {error && <p className="mt-2 text-xs font-medium text-deep">{error}</p>}
      {pendingRestore && (
        <p className="mt-2 text-xs font-medium text-deep">현재 데이터를 백업 내용으로 덮어씁니다. 계속할까요?</p>
      )}
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-dark/20 px-3.5 py-1.5 text-[13px] hover:border-dark"
        >
          {copyLabel}
        </button>
        {pendingRestore ? (
          <button
            type="button"
            onClick={confirmRestore}
            className="rounded-full bg-dark px-3.5 py-1.5 text-[13px] font-medium text-light"
          >
            복원 확인
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRestoreClick}
            className="rounded-full bg-dark px-3.5 py-1.5 text-[13px] font-medium text-light"
          >
            복원
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-dark/20 px-3.5 py-1.5 text-[13px] hover:border-dark"
        >
          닫기
        </button>
      </div>
    </>
  );
}
