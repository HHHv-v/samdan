const pad = (n: number): string => String(n).padStart(2, "0");

// toISOString()은 UTC 기준이라 로컬 날짜와 어긋날 수 있어 직접 조합한다.
export const ymd = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseDate = (s: string): Date => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (s: string, n: number): string => {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
};

export const mondayOf = (s: string): string => {
  const d = parseDate(s);
  const w = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - w);
  return ymd(d);
};

export const todayStr = (): string => ymd(new Date());

export const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export const formatWeekRange = (weekStart: string): string => {
  const start = parseDate(weekStart);
  const end = parseDate(addDays(weekStart, 6));
  return `${pad(start.getMonth() + 1)}.${pad(start.getDate())}–${pad(end.getMonth() + 1)}.${pad(end.getDate())}`;
};

export const formatDateLabel = (date: string): string => {
  const d = parseDate(date);
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

export const formatMemoTimestamp = (updatedAt: number): string => {
  const d = new Date(updatedAt);
  return ymd(d) === todayStr() ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : `${d.getMonth() + 1}.${d.getDate()}`;
};
