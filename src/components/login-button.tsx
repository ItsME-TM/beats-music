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
      className={`bg-gradient-to-r from-blue-400 text-sm to-cyan-400 text-white ${width ?? ""} ${height ?? ""} pt-1 pr-2 pb-1 pl-2 border border-[#17DCF5] rounded-xl cursor-pointer`}
    >
      {text}
    </button>
  );
}
