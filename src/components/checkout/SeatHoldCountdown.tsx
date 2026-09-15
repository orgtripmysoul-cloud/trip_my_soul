"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface SeatHoldCountdownProps {
  /** Server-provided expiry — the only source of truth. Never a client-side setTimeout(15 * 60 * 1000). */
  expiresAt: string;
  onExpire: () => void;
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function SeatHoldCountdown({ expiresAt, onExpire }: SeatHoldCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(() => new Date(expiresAt).getTime() - Date.now());
  const expiredRef = React.useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = new Date(expiresAt).getTime() - Date.now();
      setRemainingMs(remaining);
      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isLow = remainingMs < 2 * 60 * 1000;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
        isLow ? "bg-red-50 text-red-700 border border-red-150" : "bg-amber-50 text-amber-800 border border-amber-150"
      }`}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>
        {remainingMs > 0
          ? `Your seats are reserved for ${formatRemaining(remainingMs)}`
          : "Your seat reservation has expired"}
      </span>
    </div>
  );
}
