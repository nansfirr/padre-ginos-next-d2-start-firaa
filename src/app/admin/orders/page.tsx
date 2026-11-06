import Form from "next/form";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrders } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";

// Anything that is not a whole number >= 1 becomes page 1
function parsePage(value: string | string[] | undefined): number {
  const n = Number(typeof value === "string" ? value : "");
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

// Only YYYY-MM-DD is accepted; anything else means "no filter"
function parseDate(value: string | string[] | undefined): string | null {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null;
}

function pageHref(page: number, date: string | null): string {
  const query = new URLSearchParams({
    page: String(page),
    ...(date ? { date } : {}),
  });
  return `/admin/orders?${query}`;
}

export default async function OrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const page = parsePage(params.page);
  const date = parseDate(params.date);
  const { orders, totalPages } = await getOrders({ page, date });

  return (
    <section>
      <h1 className="text-3xl font-black">Order</h1>

      <Form action="/admin/orders" className="mt-4 flex items-center gap-3">
        <label className="text-sm font-medium" htmlFor="date">
          Tanggal
        </label>
        <input
          id="date"
          type="date"
          name="date"
          defaultValue={date ?? ""}
          className="rounded-lg border border-black/20 bg-white px-3 py-1.5"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand px-4 py-1.5 font-semibold text-white"
        >
          Terapkan
        </button>
        {date && (
          <Link href="/admin/orders" className="text-sm text-brand underline">
            Hapus filter
          </Link>
        )}
      </Form>

      {orders.length === 0 ? (
        <p className="mt-6 text-ink/70">Tidak ada order untuk filter ini.</p>
      ) : (
        <table className="mt-6 w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
          <thead className="bg-stone-50 text-xs uppercase text-ink/60">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Item</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-black/5">
                <td className="px-4 py-2 font-medium">
                  <Link href={`/admin/orders/${o.id}`} className="text-brand hover:underline">
                    #{o.id}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  {o.date} {o.time}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-2 text-right">{o.items}</td>
                <td className="px-4 py-2 text-right">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Halaman">
        {page > 1 ? (
          <Link href={pageHref(page - 1, date)} className="font-semibold text-brand hover:underline">
            ← Sebelumnya
          </Link>
        ) : (
          <span />
        )}
        <span className="text-ink/60">
          Halaman {page} dari {totalPages}
        </span>
        {page < totalPages ? (
          <Link href={pageHref(page + 1, date)} className="font-semibold text-brand hover:underline">
            Berikutnya →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  );
}