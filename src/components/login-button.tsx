"use client";

interface LoginButtonProps {
  text: string;
  onClick: () => void;
  width?: string;
  height?: string;
}

export default function LoginButton({ text, onClick, width, height }: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded w-[${width}] h-[${height}] pt-[14px] pr-[10px] pb-[14px] pl-[10px] border-[1px] border-[#17DCF5] rounded-[12px]`}
    >
      {text}
    </button>
  );
}
