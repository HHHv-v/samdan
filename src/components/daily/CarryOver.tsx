type CarryOverProps = {
  count: number;
  onCarryOver: () => void;
};

export default function CarryOver({ count, onCarryOver }: CarryOverProps) {
  if (count === 0) return null;

  return (
    <div className="mt-4 flex items-center justify-between gap-2 rounded-full border-[1.5px] border-dashed border-current px-[18px] py-[10px] pr-3 text-[13px]">
      <span>지난 날짜에 못 끝낸 일 {count}개</span>
      <button
        type="button"
        onClick={onCarryOver}
        className="rounded-full bg-dark px-3 py-[5px] text-xs font-medium text-light"
      >
        오늘로 가져오기
      </button>
    </div>
  );
}
