"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { nextStatuses, STATUS_LABELS, type OrderStatus } from "@/lib/orders";

export default function StatusActions({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const [state, formAction, isPending] = useActionState(updateOrderStatusAction, null);
  const options = nextStatuses(status);

  if (options.length === 0) {
    return (
      <p className="mt-4 text-sm text-ink/60">Status final, tidak bisa diubah lagi.</p>
    );
  }

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="orderId" value={orderId} />
      <div className="flex flex-wrap gap-2">
        {options.map((next) => (
          <button
            key={next}
            type="submit"
            name="status"
            value={next}
            disabled={isPending}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : `Ubah ke ${STATUS_LABELS[next]}`}
          </button>
        ))}
      </div>
      {state?.error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}