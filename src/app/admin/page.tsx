import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { AdminActions } from "./AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const [pending, approved, rejected] = await Promise.all([
    prisma.prayerNote.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { author: { select: { name: true, email: true } } },
    }),
    prisma.prayerNote.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { author: { select: { name: true } } },
    }),
    prisma.prayerNote.findMany({
      where: { status: "REJECTED" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { author: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 space-y-12">
      <header>
        <h1 className="section-title">Admin dashboard</h1>
        <p className="text-ink-700/80 mt-1">
          Moderate prayer notes submitted by the community.
        </p>
      </header>

      <section>
        <h2 className="font-display text-2xl mb-4 flex items-center gap-3">
          Pending approval
          <span className="badge bg-sunrise-500/15 text-sunrise-600">
            {pending.length}
          </span>
        </h2>

        {pending.length === 0 ? (
          <div className="card text-ink-700/70">All caught up 🌞</div>
        ) : (
          <ul className="space-y-5">
            {pending.map((n) => (
              <li key={n.id} className="card">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-700/70 mb-2">
                  <span>{formatDateTime(n.createdAt)}</span>
                  <span aria-hidden>·</span>
                  <span>
                    {n.author.name} &lt;{n.author.email}&gt;
                  </span>
                </div>
                <h3 className="font-display text-xl text-ink-800 mb-2">
                  {n.title}
                </h3>
                <p className="text-ink-700 whitespace-pre-line">{n.content}</p>
                <div className="mt-4">
                  <AdminActions prayerId={n.id} showApprove showReject showDelete />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4 flex items-center gap-3">
          Recently approved
          <span className="badge bg-cream-100 text-ink-700">{approved.length}</span>
        </h2>
        {approved.length === 0 ? (
          <div className="card text-ink-700/70">Nothing yet.</div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {approved.map((n) => (
              <li key={n.id} className="card !p-5">
                <div className="flex items-center justify-between gap-2 mb-1 text-xs text-ink-700/70">
                  <span>{formatDateTime(n.createdAt)}</span>
                  <span>{n.author.name}</span>
                </div>
                <Link
                  href={`/prayers/${n.id}`}
                  className="font-semibold text-ink-800 hover:text-sunrise-600"
                >
                  {n.title}
                </Link>
                <div className="mt-3">
                  <AdminActions prayerId={n.id} showDelete />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {rejected.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-4 flex items-center gap-3">
            Rejected
            <span className="badge bg-berry-500/10 text-berry-600">
              {rejected.length}
            </span>
          </h2>
          <ul className="space-y-3">
            {rejected.map((n) => (
              <li key={n.id} className="card !p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-800">{n.title}</p>
                  <p className="text-xs text-ink-700/70">
                    {n.author.name} · {formatDateTime(n.createdAt)}
                  </p>
                </div>
                <AdminActions prayerId={n.id} showApprove showDelete />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
