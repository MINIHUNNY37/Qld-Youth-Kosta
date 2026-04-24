import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { t } from "@/lib/i18n";
import { getServerLang } from "@/lib/i18n-server";
import { FilePreview } from "@/components/FilePreview";
import { LyricsViewer } from "@/components/LyricsViewer";

export const dynamic = "force-dynamic";

export default async function ResourceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lang = getServerLang();
  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
    include: { uploader: { select: { id: true, name: true } } },
  });

  if (!resource) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link
        href="/resources"
        className="text-sunrise-600 font-semibold hover:underline"
      >
        {t("preview.back", lang)}
      </Link>

      <header className="mt-6 mb-6 flex flex-wrap items-baseline gap-3">
        <span
          className={`badge ${
            resource.fileType === "PDF"
              ? "bg-berry-500/10 text-berry-600"
              : "bg-sunrise-500/15 text-sunrise-600"
          }`}
        >
          {resource.fileType}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-ink-800 leading-tight">
          {resource.title}
        </h1>
        <span className="text-sm text-ink-700/70">
          · {formatDate(resource.createdAt)} · {t("resources.sharedBy", lang)}{" "}
          {resource.uploader.name}
        </span>
      </header>

      {resource.description && (
        <p className="text-ink-700/90 whitespace-pre-line mb-6">
          {resource.description}
        </p>
      )}

      {resource.fileType === "LYRICS" ? (
        <LyricsViewer lyrics={resource.lyrics ?? ""} />
      ) : resource.fileUrl ? (
        <FilePreview
          fileUrl={resource.fileUrl}
          fileType={resource.fileType as "PDF" | "IMAGE"}
          title={resource.title}
          labels={{
            zoomIn: t("preview.zoomIn", lang),
            zoomOut: t("preview.zoomOut", lang),
            reset: t("preview.reset", lang),
            open: t("preview.open", lang),
          }}
        />
      ) : null}
    </div>
  );
}
