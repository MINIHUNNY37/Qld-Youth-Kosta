import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ensureAdminBootstrap } from "@/lib/bootstrap";
import { PrayerCard } from "@/components/PrayerCard";
import { QrCard } from "@/components/QrCard";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import { getServerLang } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureAdminBootstrap();
  const lang = getServerLang();

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
            {t("home.tagline", lang)}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-ink-800 leading-tight">
            {t("home.heroA", lang)}{" "}
            <span className="text-sunrise-600">{t("home.heroPray", lang)}</span>
            {lang === "en" ? "," : ""}
            <br />
            <span className="text-berry-600">{t("home.heroEncourage", lang)}</span>{" "}
            {t("home.heroAnd", lang)}{" "}
            <span className="text-sunrise-600">{t("home.heroWorship", lang)}</span>{" "}
            {t("home.heroTogether", lang)}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-700/85 max-w-2xl mx-auto">
            {t("home.subtitle", lang)}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/prayers" className="btn-primary text-base">
              {t("home.readPrayers", lang)}
            </Link>
            <Link href="/prayers/new" className="btn-secondary text-base">
              {t("home.sharePrayer", lang)}
            </Link>
          </div>
        </div>
      </section>

      {/* QR code */}
      <section className="mx-auto max-w-6xl px-5 pt-12">
        <QrCard title={t("qr.title", lang)} body={t("qr.body", lang)} />
      </section>

      {/* Recent prayers */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="section-title">{t("home.latestPrayers", lang)}</h2>
            <p className="text-ink-700/80 mt-1">{t("home.latestPrayersSub", lang)}</p>
          </div>
          <Link
            href="/prayers"
            className="text-sunrise-600 font-semibold hover:underline whitespace-nowrap"
          >
            {t("home.seeAll", lang)} →
          </Link>
        </div>

        {recentPrayers.length === 0 ? (
          <div className="card text-center text-ink-700/80">
            {t("home.noPrayers", lang)}{" "}
            <Link
              href="/prayers/new"
              className="text-sunrise-600 font-semibold underline"
            >
              {t("home.beFirst", lang)}
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
            <h2 className="section-title">{t("home.worshipResources", lang)}</h2>
            <p className="text-ink-700/80 mt-1">{t("home.worshipResourcesSub", lang)}</p>
          </div>
          <Link
            href="/resources"
            className="text-sunrise-600 font-semibold hover:underline whitespace-nowrap"
          >
            {t("home.browseAll", lang)} →
          </Link>
        </div>

        {recentResources.length === 0 ? (
          <div className="card text-center text-ink-700/80">
            {t("home.noResources", lang)}
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
                        : r.fileType === "LYRICS"
                        ? "bg-sunrise-500/15 text-sunrise-600"
                        : "bg-sunrise-500/15 text-sunrise-600"
                    }`}
                  >
                    {r.fileType}
                  </span>
                  <span>{formatDate(r.createdAt)}</span>
                </div>
                <Link
                  href={`/resources/${r.id}`}
                  className="font-display text-xl text-ink-800 leading-snug mb-1 hover:text-sunrise-600"
                >
                  {r.title}
                </Link>
                <p className="text-sm text-ink-700/75 mt-1">
                  {t("resources.sharedBy", lang)} {r.uploader.name}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
