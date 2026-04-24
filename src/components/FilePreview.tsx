"use client";

import { useState } from "react";

type Kind = "PDF" | "IMAGE";

export function FilePreview({
  fileUrl,
  fileType,
  title,
  labels,
}: {
  fileUrl: string;
  fileType: Kind;
  title: string;
  labels: { zoomIn: string; zoomOut: string; reset: string; open: string };
}) {
  const [scale, setScale] = useState(1);

  function zoomIn() {
    setScale((s) => Math.min(4, +(s + 0.25).toFixed(2)));
  }
  function zoomOut() {
    setScale((s) => Math.max(0.25, +(s - 0.25).toFixed(2)));
  }
  function reset() {
    setScale(1);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={zoomOut} className="btn-secondary !py-1.5 !px-3 text-sm">
          − {labels.zoomOut}
        </button>
        <button type="button" onClick={zoomIn} className="btn-secondary !py-1.5 !px-3 text-sm">
          + {labels.zoomIn}
        </button>
        <button type="button" onClick={reset} className="btn-secondary !py-1.5 !px-3 text-sm">
          {labels.reset}
        </button>
        <span className="text-sm text-ink-700/70 ml-1">{Math.round(scale * 100)}%</span>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !py-1.5 !px-3 text-sm ml-auto"
        >
          {labels.open}
        </a>
      </div>

      {fileType === "IMAGE" ? (
        <div className="rounded-2xl bg-cream-100 border border-cream-200 overflow-auto max-h-[80vh]">
          <div className="flex items-center justify-center p-4" style={{ minWidth: "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl}
              alt={title}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                transition: "transform 120ms ease-out",
              }}
              className="max-w-none"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-cream-100 border border-cream-200 overflow-auto h-[80vh]">
          <div
            style={{
              width: `${100 * scale}%`,
              height: `${100 * scale}%`,
              minWidth: "100%",
              minHeight: "100%",
            }}
          >
            <iframe
              title={title}
              src={fileUrl}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
