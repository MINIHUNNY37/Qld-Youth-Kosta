"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import { useLang } from "./LanguageProvider";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileType: "PDF" | "IMAGE" | "LYRICS";
  lyricsSnippet?: string | null;
  createdAt: string | Date;
  uploader: { id: string; name: string };
};

export function ResourceCard({
  resource,
  canDelete,
}: {
  resource: Resource;
  canDelete: boolean;
}) {
  const router = useRouter();
  const { t } = useLang();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`Remove "${resource.title}"?`)) return;
    setBusy(true);
    const res = await fetch(`/api/resources/${resource.id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Could not delete. Please try again.");
  }

  const badgeClass =
    resource.fileType === "PDF"
      ? "bg-berry-500/10 text-berry-600"
      : resource.fileType === "LYRICS"
      ? "bg-sunrise-500/15 text-sunrise-600"
      : "bg-sunrise-500/15 text-sunrise-600";

  const openLabel =
    resource.fileType === "PDF"
      ? t("resources.openPdf")
      : resource.fileType === "LYRICS"
      ? t("resources.viewLyrics")
      : t("resources.viewFull");

  return (
    <article className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`badge ${badgeClass}`}>{resource.fileType}</span>
          <span className="text-xs text-ink-700/70">
            {formatDate(resource.createdAt)}
          </span>
        </div>
        {canDelete && (
          <button
            onClick={remove}
            disabled={busy}
            className="text-sm text-berry-600 hover:underline disabled:opacity-60"
          >
            {busy ? "…" : t("resources.remove")}
          </button>
        )}
      </div>

      <Link
        href={`/resources/${resource.id}`}
        className="font-display text-xl text-ink-800 leading-snug hover:text-sunrise-600"
      >
        {resource.title}
      </Link>

      {resource.description && (
        <p className="text-ink-700/90 whitespace-pre-line text-sm">
          {resource.description}
        </p>
      )}

      {resource.fileType === "IMAGE" && resource.fileUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resource.fileUrl}
          alt={resource.title}
          className="rounded-xl w-full max-h-64 object-cover bg-cream-100"
        />
      ) : resource.fileType === "PDF" && resource.fileUrl ? (
        <div className="rounded-xl bg-cream-100 p-4 text-sm text-ink-700 flex items-center justify-between">
          <span className="truncate">{resource.fileName}</span>
          <span className="ml-3 text-sunrise-600 font-semibold">PDF</span>
        </div>
      ) : resource.fileType === "LYRICS" && resource.lyricsSnippet ? (
        <div className="rounded-xl bg-ink-800 text-white/90 p-4 text-sm whitespace-pre-line line-clamp-4 font-serif">
          {resource.lyricsSnippet}
        </div>
      ) : null}

      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-ink-700/70">
          {t("resources.sharedBy")}{" "}
          <span className="font-semibold">{resource.uploader.name}</span>
        </span>
        <Link
          href={`/resources/${resource.id}`}
          className="btn-secondary !py-1.5 !px-4 text-sm"
        >
          {openLabel}
        </Link>
      </div>
    </article>
  );
}
