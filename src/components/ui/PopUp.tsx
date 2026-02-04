"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface PopupProps {
  message?: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Popup({
  message,
  open,
  onConfirm,
  onCancel,
}: PopupProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label="Confirmation dialog"
    >
      {/* Gradient border frame */}
      <div
        className="relative p-[1px] rounded-2xl bg-gradient-to-br from-[#17DCF5]/70 via-white/20 to-transparent shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card content */}
        <div className="rounded-2xl bg-[#0b0b0b]/90 backdrop-blur-xl px-6 py-6 sm:px-8 sm:py-8 min-w-[280px] max-w-[92vw] w-[420px]">
          {/* Close */}
          <button
            onClick={onCancel}
            className="absolute right-3 cursor-pointer top-3 text-white/70 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-cyan-400/60 rounded-full"
            aria-label="Close dialog"
          >
            <IoClose size={20} />
          </button>

          {/* Message */}
          <div className="text-center">
            <h3 className="text-white text-xl sm:text-2xl font-bold font-k2d drop-shadow mb-3">
              {message || "Are you sure?"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              This action might change your current session.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={onConfirm}
              className="cursor-pointer w-35 px-5 py-2.5 rounded-lg font-semibold text-white bg-black/40 border border-[#17DCF5] shadow-[0_0_8px_rgba(23,220,245,0.2)] transition transition-transform duration-150 hover:bg-black/55 hover:shadow-[0_0_14px_rgba(23,220,245,0.45)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#17DCF5]/50"
            >
              Yes, I&apos;m sure
            </button>
            <button
              onClick={onCancel}
              className="px-5 py-2.5 w-35 rounded-lg font-semibold text-white bg-black/30 border border-[#17DCF5] transition transition-transform duration-150 hover:bg-black/55 hover:shadow-[0_0_14px_rgba(23,220,245,0.45)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#17DCF5]/40 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
