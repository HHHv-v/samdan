import { useState, type FormEvent } from "react";

type AddInputProps = {
  placeholder: string;
  className: string;
  onAdd: (text: string) => void;
};

export default function AddInput({ placeholder, className, onAdd }: AddInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onAdd(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-[18px]">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full rounded-full px-[22px] py-[11px] text-[15px] outline-none placeholder:opacity-85 focus:outline-2 focus:outline-offset-2 ${className}`}
      />
    </form>
  );
}
