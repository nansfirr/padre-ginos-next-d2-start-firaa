import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";

export default async function OrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  // The id comes from the URL: check it is a whole number before touching the database
  const orderId = Number(id);
  if (!Number.isInteger(orderId) || orderId < 1) notFound();

  const order = await getOrder(orderId);
  if (!order) notFound();

  return (
    <section className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-brand hover:underline">
        ← Semua order
      </Link>
      <div className="mt-4 flex items-center gap-4">
        <h1 className="text-3xl font-black">Order #{order.id}</h1>
        <StatusBadge status={order.status} />
      </div>
      <p className="mt-1 text-ink/60">
        {order.date} {order.time}
      </p>

      <table className="mt-6 w-full overflow-hidden rounded-xl bg-white text-left text-sm shadow-sm">
        <thead className="bg-stone-50 text-xs uppercase text-ink/60">
          <tr>
            <th className="px-4 py-3">Pizza</th>
            <th className="px-4 py-3">Ukuran</th>
            <th className="px-4 py-3 text-right">Jumlah</th>
            <th className="px-4 py-3 text-right">Harga</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((l, i) => (
            <tr key={`${l.pizzaId}-${l.size}-${i}`} className="border-t border-black/5">
              <td className="px-4 py-2 font-medium">
                <Link href={`/admin/products/${l.pizzaId}`} className="text-brand hover:underline">
                  {l.name}
                </Link>
              </td>
              <td className="px-4 py-2">{l.size}</td>
              <td className="px-4 py-2 text-right">{l.quantity}</td>
              <td className="px-4 py-2 text-right">{formatPrice(l.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-right text-lg font-black">
        Total {formatPrice(order.total)}
      </p>
    </section>
  );
}