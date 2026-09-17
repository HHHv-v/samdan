import type { Memo } from "../../types/memo";
import { formatMemoTimestamp } from "../../utils/date";

type MemoTilesProps = {
  memos: Memo[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
};

export default function MemoTiles({ memos, activeId, onSelect, onAdd }: MemoTilesProps) {
  const sorted = [...memos].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="-mx-0.5 mb-[18px] flex flex-none gap-3 overflow-x-auto pb-[10px] pt-0.5">
      {sorted.map((memo) => {
        const active = memo.id === activeId;
        const name = memo.title || memo.body.split("\n")[0] || "빈 메모";
        return (
          <button
            key={memo.id}
            type="button"
            title={name}
            onClick={() => onSelect(memo.id)}
            className={`flex h-[86px] w-[88px] flex-none flex-col justify-between rounded-2xl px-3 py-2.5 text-left hover:brightness-105 ${
              active ? "bg-dark text-light" : "bg-mid text-pale"
            }`}
          >
            <span className="line-clamp-2 overflow-hidden text-xs font-medium leading-snug">{name}</span>
            <small className="text-[11px]">{active ? "수정 중" : formatMemoTimestamp(memo.updatedAt)}</small>
          </button>
        );
      })}
      <button
        type="button"
        aria-label="새 메모"
        onClick={onAdd}
        className="grid h-[86px] w-[88px] flex-none place-items-center rounded-2xl bg-mid text-dark hover:brightness-105"
      >
        <svg width="36" height="36" viewBox="0 0 28 28" aria-hidden="true">
          <path d="M14 5v18M5 14h18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
