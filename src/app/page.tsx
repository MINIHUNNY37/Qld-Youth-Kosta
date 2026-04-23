import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureAdminBootstrap } from "@/lib/bootstrap";
import { PrayerCard } from "@/components/PrayerCard";
import { QrCard } from "@/components/QrCard";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureAdminBootstrap();

  const [recentPrayers, recentResources] = await Promise.all([
    prisma.prayerNote.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { uploader: { select: { name: true } } },
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24 text-center">
          <p className="text-sunrise-600 font-semibold tracking-widest text-xs uppercase mb-4">
            QLD Youth KOSTA
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-ink-800 leading-tight">
            A warm place to <span className="text-sunrise-600">pray</span>,
            <br />
            <span className="text-berry-600">encourage</span>, and{" "}
            <span className="text-sunrise-600">worship</span> together.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-700/85 max-w-2xl mx-auto">
            Share prayer requests, lift each other up, and pass on the worship
            songs that have been speaking to you this week.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/prayers" className="btn-primary text-base">
              Read prayer notes
            </Link>
            <Link href="/prayers/new" className="btn-secondary text-base">
              Share a prayer
            </Link>
          </div>
        </div>
      </section>

      {/* QR code */}
      <section className="mx-auto max-w-6xl px-5 pt-12">
        <QrCard />
      </section>

      {/* Recent prayers */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="section-title">Latest prayer notes</h2>
            <p className="text-ink-700/80 mt-1">
              Read and pray with your friends.
            </p>
          </div>
          <Link
            href="/prayers"
            className="text-sunrise-600 font-semibold hover:underline whitespace-nowrap"
          >
            See all →
          </Link>
        </div>

        {recentPrayers.length === 0 ? (
          <div className="card text-center text-ink-700/80">
            No prayers shared yet.{" "}
            <Link
              href="/prayers/new"
              className="text-sunrise-600 font-semibold underline"
            >
              Be the first to share one.
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recentPrayers.map((p) => (
              <PrayerCard
                key={p.id}
                note={{
                  id: p.id,
                  title: p.title,
                  content: p.content,
                  createdAt: p.createdAt,
                  isAnonymous: p.isAnonymous,
                  authorName: p.authorName,
                  prayedCount: p.prayedCount,
                  heartCount: p.heartCount,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent resources */}
      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="section-title">Worship resources</h2>
            <p className="text-ink-700/80 mt-1">
              Praise lyrics and worship files shared by the community.
            </p>
          </div>
          <Link
            href="/resources"
            className="text-sunrise-600 font-semibold hover:underline whitespace-nowrap"
          >
            Browse all →
          </Link>
        </div>

        {recentResources.length === 0 ? (
          <div className="card text-center text-ink-700/80">
            No resources uploaded yet.
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentResources.map((r) => (
              <li key={r.id} className="card">
                <div className="flex items-center gap-2 text-xs text-ink-700/70 mb-2">
                  <span
                    className={`badge ${
                      r.fileType === "PDF"
                        ? "bg-berry-500/10 text-berry-600"
                        : "bg-sunrise-500/15 text-sunrise-600"
                    }`}
                  >
                    {r.fileType}
                  </span>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                <h3 className="font-display text-xl text-ink-800 leading-snug mb-1">
                  {r.title}
                </h3>
                <p className="text-sm text-ink-700/75">
                  Shared by {r.uploader.name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
