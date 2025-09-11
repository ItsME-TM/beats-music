"use client";

interface PopupProps {
  message?: string;  
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Popup({ message, open, onConfirm, onCancel }: PopupProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-lg p-8 flex flex-col items-center shadow-lg">
        <span className="text-white text-lg mb-6">{message}</span>
        <div className="flex space-x-6">
          <button
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}