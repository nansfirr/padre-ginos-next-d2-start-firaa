"use client";

import { catchError, type ErrorInfo } from "next/error";

// Error boundary per widget (bukan per segmen rute seperti error.tsx).
// Hanya widget di dalamnya yang diganti fallback; widget lain tetap tampil.
function WidgetError({ title }: { title: string }, { retry }: ErrorInfo) {
  return (
    <div role="alert" className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-ink/60">{title}</h2>
      <p className="mt-3 text-sm text-red-700">Gagal memuat data ini.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-3 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white"
      >
        Coba lagi
      </button>
    </div>
  );
}

export default catchError(WidgetError);