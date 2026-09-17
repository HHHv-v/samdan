import { useEffect, useRef } from "react";
import { useBoardStore } from "../../store/board";
import MemoTiles from "./MemoTiles";
import MemoEditor from "./MemoEditor";

export default function MemoColumn() {
  const memos = useBoardStore((s) => s.memos);
  const activeMemoId = useBoardStore((s) => s.activeMemoId);
  const addMemo = useBoardStore((s) => s.addMemo);
  const updateMemo = useBoardStore((s) => s.updateMemo);
  const removeMemo = useBoardStore((s) => s.removeMemo);
  const setActiveMemo = useBoardStore((s) => s.setActiveMemo);

  // StrictMode에서 effect가 두 번 실행돼도(같은 렌더의 memos=[] 스냅샷을 두 번 보게 됨)
  // 빈 메모가 중복 생성되지 않도록 ref로 한 번만 실행되게 막는다.
  const seededRef = useRef(false);

  useEffect(() => {
    if (memos.length === 0) {
      if (!seededRef.current) {
        seededRef.current = true;
        addMemo();
      }
      return;
    }
    if (!memos.some((m) => m.id === activeMemoId)) {
      setActiveMemo(memos[0].id);
    }
  }, [memos, activeMemoId, addMemo, setActiveMemo]);

  const active = memos.find((m) => m.id === activeMemoId) ?? null;

  return (
    <section className="flex min-h-0 flex-col overflow-y-auto bg-light px-7 py-6 text-dark">
      <div className="mb-[22px] flex min-h-10 items-center">
        <h2 className="font-display text-[30px] tracking-tight">MEMO</h2>
      </div>

      <MemoTiles memos={memos} activeId={activeMemoId} onSelect={setActiveMemo} onAdd={addMemo} />

      <MemoEditor
        key={active?.id ?? "none"}
        memo={active}
        onChange={(patch) => active && updateMemo(active.id, patch)}
        onDelete={() => active && removeMemo(active.id)}
      />
    </section>
  );
}
