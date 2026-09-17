import { create } from "zustand";
import { persist, type PersistStorage, type StorageValue } from "zustand/middleware";
import type { Todo, TodoType } from "../types/todo";
import type { Memo } from "../types/memo";
import type { BoardState } from "../types/board";
import { addDays, mondayOf, todayStr } from "../utils/date";
import { uid } from "../utils/id";

const STORAGE_KEY = "todo-board-v1";
const STORAGE_VERSION = 1;

type LegacyPersisted = {
  todos?: unknown;
  memos?: unknown;
  memo?: { body?: string; updatedAt?: number };
};

function hasStateKey(value: unknown): value is StorageValue<BoardState> {
  return typeof value === "object" && value !== null && "state" in value;
}

function normalizeLegacyMemos(legacy: LegacyPersisted): Memo[] {
  const memos = Array.isArray(legacy.memos) ? (legacy.memos as Memo[]) : [];
  if (legacy.memo?.body) {
    return [
      {
        id: uid(),
        title: "",
        body: legacy.memo.body,
        updatedAt: legacy.memo.updatedAt ?? Date.now(),
      },
      ...memos,
    ];
  }
  return memos;
}

// docs/mvp.html은 { todos, memos }를 zustand의 { state, version } 형태로 감싸지 않고
// localStorage에 그대로 저장했다. state 키가 없으면 그 형식으로 보고 version 0으로 취급한다.
const boardStorage: PersistStorage<BoardState> = {
  getItem: (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
    if (hasStateKey(parsed)) return parsed;
    return { state: parsed as BoardState, version: 0 };
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

type BoardStore = BoardState & {
  viewDate: string;
  viewWeek: string;
  activeMemoId: string | null;

  addTodo: (type: TodoType, text: string) => void;
  updateTodo: (
    id: string,
    patch: Partial<Pick<Todo, "text" | "done" | "date" | "weekStart">>
  ) => void;
  removeTodo: (id: string) => void;
  copyWeeklyToDaily: (id: string) => void;
  moveToTomorrow: (id: string) => void;
  carryOverToToday: () => void;

  addMemo: () => void;
  updateMemo: (id: string, patch: Partial<Pick<Memo, "title" | "body">>) => void;
  removeMemo: (id: string) => void;
  setActiveMemo: (id: string | null) => void;

  goToPrevWeek: () => void;
  goToNextWeek: () => void;
  goToThisWeek: () => void;
  goToPrevDay: () => void;
  goToNextDay: () => void;
  goToToday: () => void;

  restoreBoard: (data: BoardState) => void;
};

export function parseBackupPayload(text: string): BoardState | null {
  try {
    const data = JSON.parse(text) as LegacyPersisted;
    if (!Array.isArray(data.todos)) return null;
    return { todos: data.todos as Todo[], memos: normalizeLegacyMemos(data) };
  } catch {
    return null;
  }
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      todos: [],
      memos: [],
      viewDate: todayStr(),
      viewWeek: mondayOf(todayStr()),
      activeMemoId: null,

      addTodo: (type, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const { viewDate, viewWeek } = get();
        const todo: Todo = {
          id: uid(),
          text: trimmed,
          done: false,
          type,
          date: type === "daily" ? viewDate : null,
          weekStart: type === "weekly" ? viewWeek : null,
          createdAt: Date.now(),
        };
        set((state) => ({ todos: [...state.todos, todo] }));
      },

      updateTodo: (id, patch) => {
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }));
      },

      removeTodo: (id) => {
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
      },

      copyWeeklyToDaily: (id) => {
        const source = get().todos.find((t) => t.id === id);
        if (!source) return;
        const todo: Todo = {
          id: uid(),
          text: source.text,
          done: false,
          type: "daily",
          date: get().viewDate,
          weekStart: null,
          createdAt: Date.now(),
        };
        set((state) => ({ todos: [...state.todos, todo] }));
      },

      moveToTomorrow: (id) => {
        const source = get().todos.find((t) => t.id === id);
        if (!source || !source.date) return;
        get().updateTodo(id, { date: addDays(source.date, 1) });
      },

      carryOverToToday: () => {
        const today = todayStr();
        set((state) => ({
          todos: state.todos.map((t) =>
            t.type === "daily" && !t.done && t.date !== null && t.date < today
              ? { ...t, date: today }
              : t
          ),
        }));
      },

      addMemo: () => {
        const memo: Memo = { id: uid(), title: "", body: "", updatedAt: Date.now() };
        set((state) => ({ memos: [memo, ...state.memos], activeMemoId: memo.id }));
      },

      updateMemo: (id, patch) => {
        set((state) => ({
          memos: state.memos.map((m) =>
            m.id === id ? { ...m, ...patch, updatedAt: Date.now() } : m
          ),
        }));
      },

      removeMemo: (id) => {
        set((state) => ({
          memos: state.memos.filter((m) => m.id !== id),
          activeMemoId: state.activeMemoId === id ? null : state.activeMemoId,
        }));
      },

      setActiveMemo: (id) => set({ activeMemoId: id }),

      goToPrevWeek: () => set((state) => ({ viewWeek: addDays(state.viewWeek, -7) })),
      goToNextWeek: () => set((state) => ({ viewWeek: addDays(state.viewWeek, 7) })),
      goToThisWeek: () => set({ viewWeek: mondayOf(todayStr()) }),
      goToPrevDay: () => set((state) => ({ viewDate: addDays(state.viewDate, -1) })),
      goToNextDay: () => set((state) => ({ viewDate: addDays(state.viewDate, 1) })),
      goToToday: () => set({ viewDate: todayStr() }),

      restoreBoard: (data) => set({ todos: data.todos, memos: data.memos, activeMemoId: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: boardStorage,
      version: STORAGE_VERSION,
      partialize: (state) => ({ todos: state.todos, memos: state.memos }),
      migrate: (persistedState, version) => {
        if (version === STORAGE_VERSION) return persistedState as BoardState;
        const legacy = persistedState as LegacyPersisted;
        return {
          todos: Array.isArray(legacy.todos) ? (legacy.todos as Todo[]) : [],
          memos: normalizeLegacyMemos(legacy),
        };
      },
    }
  )
);
