import { useEffect, useRef, useState } from "react";
import type { Todo } from "../../types/todo";
import CheckButton from "./CheckButton";

type TodoItemProps = {
  todo: Todo;
  className: string;
  checkColorClassName: string;
  secondaryLabel: string;
  onToggle: () => void;
  onEdit: (text: string) => void;
  onRemove: () => void;
  onSecondaryAction: () => void;
};

export default function TodoItem({
  todo,
  className,
  checkColorClassName,
  secondaryLabel,
  onToggle,
  onEdit,
  onRemove,
  onSecondaryAction,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function startEdit() {
    setDraft(todo.text);
    setEditing(true);
  }

  function commit() {
    const trimmed = draft.trim();
    if (trimmed) onEdit(trimmed);
    setEditing(false);
  }

  return (
    <li className={`group flex items-center gap-[10px] rounded-full py-[9px] pr-[14px] pl-3 ${className}`}>
      <CheckButton done={todo.done} checkColorClassName={checkColorClassName} onToggle={onToggle} />

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="min-w-0 flex-1 border-b-[1.5px] border-current bg-transparent text-[15px] outline-none"
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          title="더블클릭해서 수정"
          className={`min-w-0 flex-1 cursor-text break-words text-[15px] ${todo.done ? "line-through" : ""}`}
        >
          {todo.text}
        </span>
      )}

      <div className="hidden flex-none gap-0.5 group-hover:flex group-focus-within:flex">
        <button
          type="button"
          onClick={onSecondaryAction}
          className="whitespace-nowrap rounded-full border border-current px-[9px] py-px text-xs"
        >
          {secondaryLabel}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="whitespace-nowrap rounded-full border border-transparent px-[9px] py-px text-xs"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
