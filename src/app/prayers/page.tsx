import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PrayerCard } from "@/components/PrayerCard";
import { t } from "@/lib/i18n";
import { getServerLang } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function PrayersPage() {
  const lang = getServerLang();
  const notes = await prisma.prayerNote.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">{t("prayers.title", lang)}</h1>
          <p className="text-ink-700/80 mt-1 max-w-2xl">
            {t("prayers.subtitle", lang)}
          </p>
        </div>
        <Link href="/prayers/new" className="btn-primary whitespace-nowrap">
          {t("prayers.share", lang)}
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="card text-center">
          <p className="text-ink-700/80 text-lg">{t("prayers.empty", lang)}</p>
          <div className="mt-4">
            <Link href="/prayers/new" className="btn-primary">
              {t("prayers.shareFirst", lang)}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <PrayerCard
              key={n.id}
              note={{
                id: n.id,
                title: n.title,
                content: n.content,
                createdAt: n.createdAt,
                isAnonymous: n.isAnonymous,
                authorName: n.authorName,
                prayedCount: n.prayedCount,
                heartCount: n.heartCount,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
