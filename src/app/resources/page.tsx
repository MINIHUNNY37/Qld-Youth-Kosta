import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ResourceCard } from "@/components/ResourceCard";
import { t } from "@/lib/i18n";
import { getServerLang } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const session = await getSession();
  const lang = getServerLang();
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    include: { uploader: { select: { id: true, name: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">{t("resources.title", lang)}</h1>
          <p className="text-ink-700/80 mt-1 max-w-2xl">
            {t("resources.subtitle", lang)}
          </p>
        </div>
        {session ? (
          <Link href="/resources/new" className="btn-primary whitespace-nowrap">
            {t("resources.upload", lang)}
          </Link>
        ) : (
          <Link href="/login" className="btn-secondary whitespace-nowrap">
            {t("resources.signInToUpload", lang)}
          </Link>
        )}
      </div>

      {resources.length === 0 ? (
        <div className="card text-center text-ink-700/80">
          {t("resources.empty", lang)}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <ResourceCard
              key={r.id}
              resource={{
                id: r.id,
                title: r.title,
                description: r.description,
                fileUrl: r.fileUrl,
                fileName: r.fileName,
                fileType: r.fileType as "PDF" | "IMAGE" | "LYRICS",
                lyricsSnippet: r.lyrics ? r.lyrics.slice(0, 240) : null,
                createdAt: r.createdAt.toISOString(),
                uploader: { id: r.uploader.id, name: r.uploader.name },
              }}
              canDelete={
                !!session &&
                (session.role === "ADMIN" || session.sub === r.uploaderId)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
