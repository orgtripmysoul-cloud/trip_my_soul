"use client";

import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalShellProps {
  onClose: () => void;
  children: React.ReactNode;
  /** Width and text alignment of the panel — overridden by the wider list modals. */
  className?: string;
}

/**
 * Dimmed backdrop + white rounded panel with a close button, shared by every
 * detail-page modal.
 *
 * Rendered into `document.body` through a portal: the booking sidebar is a
 * `backdrop-filter` card, which would otherwise become the containing block for
 * a `fixed` overlay and trap the modal inside the card.
 */
export default function ModalShell({
  onClose,
  children,
  className = "max-w-md text-center",
}: ModalShellProps) {
  // Every caller opens this from a click, so the document always exists by then;
  // the guard only keeps a server render from touching `document`.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white border border-gray-100 rounded-3xl p-6 md:p-8 w-full space-y-5 shadow-2xl relative font-sans max-h-[85vh] overflow-y-auto ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
