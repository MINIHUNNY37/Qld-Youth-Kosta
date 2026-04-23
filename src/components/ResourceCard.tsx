"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/format";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileType: "PDF" | "IMAGE";
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

  return (
    <article className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`badge ${
              resource.fileType === "PDF"
                ? "bg-berry-500/10 text-berry-600"
                : "bg-sunrise-500/15 text-sunrise-600"
            }`}
          >
            {resource.fileType}
          </span>
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
            {busy ? "…" : "Remove"}
          </button>
        )}
      </div>

      <h3 className="font-display text-xl text-ink-800 leading-snug">
        {resource.title}
      </h3>
      {resource.description && (
        <p className="text-ink-700/90 whitespace-pre-line">
          {resource.description}
        </p>
      )}

      {resource.fileType === "IMAGE" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resource.fileUrl}
          alt={resource.title}
          className="rounded-xl w-full max-h-80 object-cover bg-cream-100"
        />
      ) : (
        <div className="rounded-xl bg-cream-100 p-4 text-sm text-ink-700 flex items-center justify-between">
          <span className="truncate">{resource.fileName}</span>
          <span className="ml-3 text-sunrise-600 font-semibold">PDF</span>
        </div>
      )}

      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-ink-700/70">
          Shared by <span className="font-semibold">{resource.uploader.name}</span>
        </span>
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary !py-1.5 !px-4 text-sm"
        >
          {resource.fileType === "PDF" ? "Open PDF" : "View full"}
        </a>
      </div>
    </article>
  );
}
