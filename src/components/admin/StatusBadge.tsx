import { STATUS_LABELS, type OrderStatus } from "@/lib/orders";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  preparing: "bg-blue-100 text-blue-900",
  ready: "bg-green-100 text-green-900",
  delivered: "bg-stone-200 text-stone-700",
  cancelled: "bg-red-100 text-red-900",
};

// Pure display: no hooks, so it works in Server and Client Components
export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}