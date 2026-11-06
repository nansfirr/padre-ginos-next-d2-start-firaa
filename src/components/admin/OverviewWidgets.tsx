import { getLatestDay, getStatusCounts, getTopPizzas } from "@/lib/admin-data";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/orders";

// Keputusan per widget:
// - Hari terakhir: stream. Cepat (±0,3 s), data harus segar, jadi tidak di-cache.
// - Status order: stream + error boundary sendiri. Dinamis (membaca cookie
//   simulasi) dan satu-satunya yang bisa gagal.
// - Terlaris: cache. Agregat seluruh riwayat (±1,8 s) yang jarang berubah;
//   dihitung sekali per jam, bukan setiap kunjungan.

const CARD = "rounded-xl bg-white p-5 shadow-sm";

export async function LatestDayWidget() {
  const day = await getLatestDay();
  return (
    <div className={CARD}>
        {/* stream, tidak di-cache, karena cepat dan harus segar */}
      <h2 className="text-sm font-semibold text-ink/60">Hari terakhir</h2> 
      <p className="mt-1 text-xs text-ink/50">{day.date}</p>
      <p className="mt-3 text-3xl font-black">{formatPrice(day.revenue)}</p>
      <p className="text-sm text-ink/70">{day.orders} order</p>
    </div>
  );
}

export async function StatusCountsWidget() {
  const counts = await getStatusCounts();
  return (
    <div className={CARD}>
        {/* stream dengan error boundary sendiri, karena dinamis dan satu-satunya yang bisa gagal. */}
      <h2 className="text-sm font-semibold text-ink/60">Status order hari itu</h2>
      <ul className="mt-3 space-y-1 text-sm">
        {ORDER_STATUSES.map((s) => (
          <li key={s} className="flex justify-between">
            <span>{STATUS_LABELS[s]}</span>
            <span className="font-semibold">{counts[s]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function TopPizzasWidget() {
  const topPizzas = await getTopPizzas();
  return (
    <div className={CARD}>
        {/* cache satu jam, karena agregat lambat yang hampir tidak berubah. */}
      <h2 className="text-sm font-semibold text-ink/60">Terlaris sepanjang masa</h2>
      <ol className="mt-3 space-y-1 text-sm">
        {topPizzas.map((p, i) => (
          <li key={p.id} className="flex justify-between gap-2">
            <span>
              {i + 1}. {p.name}
            </span>
            <span className="font-semibold">{p.sold}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function WidgetSkeleton({ title }: { title: string }) {
  return (
    <div className={CARD}>
      <h2 className="text-sm font-semibold text-ink/60">{title}</h2>
      <p className="mt-3 animate-pulse text-sm text-ink/50">Memuat…</p>
    </div>
  );
}