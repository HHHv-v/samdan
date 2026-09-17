type CheckButtonProps = {
  done: boolean;
  checkColorClassName: string;
  onToggle: () => void;
};

export default function CheckButton({ done, checkColorClassName, onToggle }: CheckButtonProps) {
  return (
    <button
      type="button"
      aria-label={done ? "완료 취소" : "완료"}
      onClick={onToggle}
      className={`grid size-[22px] flex-none place-items-center rounded-full border-[1.5px] border-current p-0 ${
        done ? "bg-current" : ""
      }`}
    >
      {done && (
        <svg
          viewBox="0 0 12 10"
          className={`h-2.5 w-3 ${checkColorClassName}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 5l3.2 3.2L11 1.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
