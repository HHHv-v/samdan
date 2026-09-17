import { useBoardStore } from "../../store/board";
import { formatWeekRange, mondayOf, todayStr } from "../../utils/date";
import { sortTodos } from "../../utils/todo";
import AddInput from "../common/AddInput";
import TodoItem from "../common/TodoItem";

export default function WeeklyColumn() {
  const viewWeek = useBoardStore((s) => s.viewWeek);
  const todos = useBoardStore((s) => s.todos);
  const addTodo = useBoardStore((s) => s.addTodo);
  const updateTodo = useBoardStore((s) => s.updateTodo);
  const removeTodo = useBoardStore((s) => s.removeTodo);
  const copyWeeklyToDaily = useBoardStore((s) => s.copyWeeklyToDaily);
  const goToPrevWeek = useBoardStore((s) => s.goToPrevWeek);
  const goToNextWeek = useBoardStore((s) => s.goToNextWeek);
  const goToThisWeek = useBoardStore((s) => s.goToThisWeek);

  const isCurrentWeek = viewWeek === mondayOf(todayStr());
  const items = sortTodos(todos.filter((t) => t.type === "weekly" && t.weekStart === viewWeek));

  return (
    <section className="flex min-h-0 flex-col overflow-y-auto bg-dark px-7 py-6 text-light">
      <div className="mb-[22px] flex min-h-10 items-center justify-between gap-2">
        <h2 className="shrink-0 text-[30px] font-extrabold tracking-tight">WEEKLY</h2>
        <div className="flex shrink-0 items-center gap-1">
          {!isCurrentWeek && (
            <button
              type="button"
              onClick={goToThisWeek}
              className="h-6 shrink-0 whitespace-nowrap rounded-full border border-current px-[10px] text-xs"
            >
              이번 주
            </button>
          )}
          <button
            type="button"
            aria-label="지난주"
            onClick={goToPrevWeek}
            className="grid size-[30px] shrink-0 place-items-center rounded-full text-lg hover:bg-light/10"
          >
            ‹
          </button>
          <span className="shrink-0 whitespace-nowrap px-1 text-[15px] tabular-nums">
            {formatWeekRange(viewWeek)}
          </span>
          <button
            type="button"
            aria-label="다음주"
            onClick={goToNextWeek}
            className="grid size-[30px] shrink-0 place-items-center rounded-full text-lg hover:bg-light/10"
          >
            ›
          </button>
        </div>
      </div>

      <AddInput
        placeholder="이번 주에 할 일을 추가하세요"
        className="bg-light text-dark placeholder:text-dark focus:outline-light"
        onAdd={(text) => addTodo("weekly", text)}
      />

      <ul className="flex flex-col gap-[10px]">
        {items.length === 0 ? (
          <li className="px-1.5 py-1 text-sm">아직 할 일이 없어요</li>
        ) : (
          items.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              className="bg-light text-dark hover:brightness-[1.04]"
              checkColorClassName="text-light"
              secondaryLabel="오늘로"
              onToggle={() => updateTodo(todo.id, { done: !todo.done })}
              onEdit={(text) => updateTodo(todo.id, { text })}
              onRemove={() => removeTodo(todo.id)}
              onSecondaryAction={() => copyWeeklyToDaily(todo.id)}
            />
          ))
        )}
      </ul>
    </section>
  );
}
