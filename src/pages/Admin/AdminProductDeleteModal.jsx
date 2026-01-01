import React from "react";
import { Trash2, X } from "lucide-react";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6 sm:p-7 animate-scaleIn">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Content */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
          {title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600 text-center">
          {description}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
