import { useBoardStore } from "../../store/board";
import { formatDateLabel, todayStr } from "../../utils/date";
import { sortTodos } from "../../utils/todo";
import AddInput from "../common/AddInput";
import TodoItem from "../common/TodoItem";
import DateCard from "./DateCard";
import CarryOver from "./CarryOver";

export default function DailyColumn() {
  const viewDate = useBoardStore((s) => s.viewDate);
  const todos = useBoardStore((s) => s.todos);
  const addTodo = useBoardStore((s) => s.addTodo);
  const updateTodo = useBoardStore((s) => s.updateTodo);
  const removeTodo = useBoardStore((s) => s.removeTodo);
  const moveToTomorrow = useBoardStore((s) => s.moveToTomorrow);
  const carryOverToToday = useBoardStore((s) => s.carryOverToToday);
  const goToPrevDay = useBoardStore((s) => s.goToPrevDay);
  const goToNextDay = useBoardStore((s) => s.goToNextDay);
  const goToToday = useBoardStore((s) => s.goToToday);

  const today = todayStr();
  const isToday = viewDate === today;
  const items = sortTodos(todos.filter((t) => t.type === "daily" && t.date === viewDate));
  const doneCount = items.filter((t) => t.done).length;
  const carryCount = todos.filter(
    (t) => t.type === "daily" && !t.done && t.date !== null && t.date < today
  ).length;

  return (
    <section className="flex min-h-0 flex-col overflow-y-auto bg-mid px-7 py-6 text-deep">
      <div className="mb-[22px] flex min-h-10 items-center justify-between gap-2">
        <h2 className="shrink-0 font-display text-[30px] tracking-tight">DAILY</h2>
        <div className="flex shrink-0 items-center gap-1">
          {!isToday && (
            <button
              type="button"
              onClick={goToToday}
              className="h-6 shrink-0 whitespace-nowrap rounded-full border border-current px-[10px] text-xs"
            >
              오늘
            </button>
          )}
          <button
            type="button"
            aria-label="이전 날"
            onClick={goToPrevDay}
            className="grid size-[30px] shrink-0 place-items-center rounded-full text-lg hover:bg-dark/15"
          >
            ‹
          </button>
          <span className="shrink-0 whitespace-nowrap px-1 text-[15px] tabular-nums">
            {formatDateLabel(viewDate)}
          </span>
          <button
            type="button"
            aria-label="다음 날"
            onClick={goToNextDay}
            className="grid size-[30px] shrink-0 place-items-center rounded-full text-lg hover:bg-dark/15"
          >
            ›
          </button>
        </div>
      </div>

      <DateCard date={viewDate} doneCount={doneCount} totalCount={items.length} />

      <AddInput
        placeholder="할 일을 추가하거나, 왼쪽 주간 목록에서 오늘로 가져오세요"
        className="bg-dark text-light placeholder:text-light focus:outline-deep"
        onAdd={(text) => addTodo("daily", text)}
      />

      <ul className="flex flex-col gap-[10px]">
        {items.length === 0 ? (
          <li className="px-1.5 py-1 text-sm">아직 할 일이 없어요</li>
        ) : (
          items.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              className="bg-dark text-light hover:brightness-[1.04]"
              checkColorClassName="text-dark"
              secondaryLabel="내일로"
              onToggle={() => updateTodo(todo.id, { done: !todo.done })}
              onEdit={(text) => updateTodo(todo.id, { text })}
              onRemove={() => removeTodo(todo.id)}
              onSecondaryAction={() => moveToTomorrow(todo.id)}
            />
          ))
        )}
      </ul>

      {isToday && <CarryOver count={carryCount} onCarryOver={carryOverToToday} />}
    </section>
  );
}
