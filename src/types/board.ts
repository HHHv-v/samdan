import type { Todo } from "./todo";
import type { Memo } from "./memo";

export type BoardState = {
  todos: Todo[];
  memos: Memo[];
};
