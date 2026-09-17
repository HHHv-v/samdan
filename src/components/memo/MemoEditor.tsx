import { useEffect, useRef, useState } from "react";
import type { Memo } from "../../types/memo";
import { formatMemoTimestamp } from "../../utils/date";

type MemoEditorProps = {
  memo: Memo | null;
  onChange: (patch: Partial<Pick<Memo, "title" | "body">>) => void;
  onDelete: () => void;
};

export default function MemoEditor({ memo, onChange, onDelete }: MemoEditorProps) {
  const [title, setTitle] = useState(memo?.title ?? "");
  const [body, setBody] = useState(memo?.body ?? "");
  const [pending, setPending] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function schedule(next: Partial<Pick<Memo, "title" | "body">>) {
    setPending(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onChange(next);
      setPending(false);
    }, 400);
  }

  if (!memo) return null;

  return (
    <div className="flex min-h-[220px] flex-1 flex-col">
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          schedule({ title: e.target.value, body });
        }}
        placeholder="제목"
        className="rounded-[10px] px-3.5 pb-2.5 pt-1 text-2xl font-bold text-dark outline-none placeholder:text-mid focus:bg-mid/20"
      />
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          schedule({ title, body: e.target.value });
        }}
        placeholder="내용을 입력하세요"
        className="flex-1 resize-none rounded-[10px] px-3.5 py-2 text-[15px] leading-[1.75] text-dark outline-none placeholder:text-mid focus:bg-mid/20"
      />
      <div className="flex items-center justify-between pt-2.5 text-sm font-medium text-dark">
        <span>{pending ? "저장 중…" : `마지막 저장 ${formatMemoTimestamp(memo.updatedAt)}`}</span>
        {confirmingDelete ? (
          <span className="flex items-center gap-3">
            <button type="button" onClick={() => setConfirmingDelete(false)} className="hover:text-deep">
              취소
            </button>
            <button type="button" onClick={onDelete} className="font-semibold hover:text-deep">
              삭제 확인
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmingDelete(true)} className="hover:text-deep">
            메모 삭제
          </button>
        )}
      </div>
    </div>
  );
}
