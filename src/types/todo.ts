export type TodoType = "daily" | "weekly";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
  type: TodoType;
  date: string | null; // daily: "YYYY-MM-DD"
  weekStart: string | null; // weekly: 해당 주 월요일 "YYYY-MM-DD"
  createdAt: number;
};
