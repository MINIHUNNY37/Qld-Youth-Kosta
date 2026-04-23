"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export function QrCard() {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.origin);
    }
  }, []);

  return (
    <div className="card flex flex-col sm:flex-row items-center gap-6 bg-white">
      <div className="rounded-xl border border-cream-200 p-3 bg-white shrink-0">
        {url ? (
          <QRCodeSVG
            value={url}
            size={160}
            bgColor="#ffffff"
            fgColor="#2A1C13"
            level="M"
            includeMargin={false}
          />
        ) : (
          <div className="w-[160px] h-[160px] bg-cream-100 animate-pulse rounded" />
        )}
      </div>
      <div className="text-center sm:text-left">
        <h3 className="font-display text-2xl text-ink-800 mb-1">
          Scan to join
        </h3>
        <p className="text-ink-700/80">
          Open the camera on your phone, point it at this code, and tap the
          link to share a prayer or browse worship resources.
        </p>
        {url && (
          <p className="mt-3 text-sm text-ink-700/60 break-all">
            {url}
          </p>
        )}
      </div>
    </div>
  );
}
