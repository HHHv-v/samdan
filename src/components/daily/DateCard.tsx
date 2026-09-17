import { parseDate, WEEKDAY_LABELS } from "../../utils/date";

type DateCardProps = {
  date: string;
  doneCount: number;
  totalCount: number;
};

export default function DateCard({
  date,
  doneCount,
  totalCount,
}: DateCardProps) {
  const d = parseDate(date);

  const percent = totalCount ? (doneCount / totalCount) * 100 : 0;

  return (
    <div className="mb-[18px] rounded-[20px] bg-dark px-[22px] pb-4 pt-[18px] text-light">
      <div className="flex items-center gap-5">
        <div className="text-[64px] font-extrabold leading-[0.95] tracking-[-3px] tabular-nums">
          {d.getDate()}
        </div>
        <div>
          <strong className="block text-base">
            {WEEKDAY_LABELS[d.getDay()]}요일
          </strong>
          <span className="text-[15px]">
            {d.getFullYear()}년 {d.getMonth() + 1}월
          </span>
        </div>
      </div>
      <div className="mt-[14px] flex items-center gap-3">
        <div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-light/30">
          <div
            className="h-full rounded-[3px] bg-light transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <small className="text-xs font-medium tabular-nums">
          {doneCount} / {totalCount}
        </small>
      </div>
    </div>
  );
}
