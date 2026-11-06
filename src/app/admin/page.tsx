// // import Link from "next/link";

// // export default function AdminHome() {
// //   return (
// //     <section>
// //       <h1 className="text-3xl font-black">Overview</h1>
// //       <p className="mt-2 text-ink/70">
// //         Pilih menu di samping. Ringkasan harian menyusul.
// //       </p>
// //       <div className="mt-6 flex gap-4">
// //         <Link href="/admin/products" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
// //           Kelola produk →
// //         </Link>
// //         <Link href="/admin/orders" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
// //           Lihat order →
// //         </Link>
// //       </div>
// //     </section>
// //   );
// // }

// import Link from "next/link";
// import { getLatestDay, getStatusCounts, getTopPizzas } from "@/lib/admin-data";
// import { formatPrice } from "@/lib/format";
// import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/orders";

// // Versi rekan tim: berfungsi, tapi lambat dan rapuh.
// export default async function AdminHome() {
//   const [day, topPizzas, counts] = await Promise.all([
//     getLatestDay(),
//     getTopPizzas(),
//     getStatusCounts(),
//   ]);

//   return (
//     <section>
//       <h1 className="text-3xl font-black">Overview</h1>

//       <div className="mt-6 grid gap-4 md:grid-cols-3">
//         <div className="rounded-xl bg-white p-5 shadow-sm">
//           <h2 className="text-sm font-semibold text-ink/60">Hari terakhir</h2>
//           <p className="mt-1 text-xs text-ink/50">{day.date}</p>
//           <p className="mt-3 text-3xl font-black">{formatPrice(day.revenue)}</p>
//           <p className="text-sm text-ink/70">{day.orders} order</p>
//         </div>

//         <div className="rounded-xl bg-white p-5 shadow-sm">
//           <h2 className="text-sm font-semibold text-ink/60">Status order hari itu</h2>
//           <ul className="mt-3 space-y-1 text-sm">
//             {ORDER_STATUSES.map((s) => (
//               <li key={s} className="flex justify-between">
//                 <span>{STATUS_LABELS[s]}</span>
//                 <span className="font-semibold">{counts[s]}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="rounded-xl bg-white p-5 shadow-sm">
//           <h2 className="text-sm font-semibold text-ink/60">Terlaris sepanjang masa</h2>
//           <ol className="mt-3 space-y-1 text-sm">
//             {topPizzas.map((p, i) => (
//               <li key={p.id} className="flex justify-between gap-2">
//                 <span>
//                   {i + 1}. {p.name}
//                 </span>
//                 <span className="font-semibold">{p.sold}</span>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </div>

//       <div className="mt-6 flex gap-4">
//         <Link href="/admin/products" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
//           Kelola produk →
//         </Link>
//         <Link href="/admin/orders" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
//           Lihat order →
//         </Link>
//       </div>
//     </section>
//   );
// }

import Link from "next/link";
import { Suspense } from "react";
import {
  LatestDayWidget,
  StatusCountsWidget,
  TopPizzasWidget,
  WidgetSkeleton,
} from "@/components/admin/OverviewWidgets";
import WidgetErrorBoundary from "@/components/admin/WidgetErrorBoundary";

export default function AdminHome() {
  return (
    <section>
      <h1 className="text-3xl font-black">Overview</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Suspense fallback={<WidgetSkeleton title="Hari terakhir" />}>
          <LatestDayWidget />
        </Suspense>

        {/* <Suspense fallback={<WidgetSkeleton title="Status order hari itu" />}>
          <StatusCountsWidget />
        </Suspense> */}

        <WidgetErrorBoundary title="Status order hari itu">
            <Suspense fallback={<WidgetSkeleton title="Status order hari itu" />}>
            <StatusCountsWidget />
            </Suspense>
        </WidgetErrorBoundary>

        <Suspense fallback={<WidgetSkeleton title="Terlaris sepanjang masa" />}>
          <TopPizzasWidget />
        </Suspense>
      </div>

      <div className="mt-6 flex gap-4">
        <Link href="/admin/products" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
          Kelola produk →
        </Link>
        <Link href="/admin/orders" className="rounded-xl bg-white px-5 py-4 font-semibold shadow-sm">
          Lihat order →
        </Link>
      </div>
    </section>
  );
}