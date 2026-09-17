import type { Todo } from "../types/todo";

export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => Number(a.done) - Number(b.done) || a.createdAt - b.createdAt);
}
