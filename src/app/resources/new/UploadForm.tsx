"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";

const ACCEPT = "application/pdf,image/png,image/jpeg,image/gif,image/webp";
const MAX_MB = 8;

type Mode = "FILE" | "LYRICS";

export function UploadForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const { t } = useLang();

  const [mode, setMode] = useState<Mode>("FILE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [lyrics, setLyrics] = useState("");
  const [uploaderName, setUploaderName] = useState(defaultName);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "FILE") {
      if (!file) {
        setError("Please choose a file.");
        return;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`File is too large (max ${MAX_MB} MB).`);
        return;
      }
      setBusy(true);
      const fd = new FormData();
      fd.set("title", title);
      fd.set("description", description);
      fd.set("file", file);
      if (!isAnonymous && uploaderName) fd.set("uploaderName", uploaderName);
      fd.set("isAnonymous", String(isAnonymous));
      const res = await fetch("/api/resources", { method: "POST", body: fd });
      if (res.ok) {
        router.push("/resources");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Upload failed.");
        setBusy(false);
      }
    } else {
      if (!lyrics.trim()) {
        setError("Please enter some lyrics.");
        return;
      }
      setBusy(true);
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          lyrics,
          uploaderName: isAnonymous ? undefined : uploaderName,
          isAnonymous,
        }),
      });
      if (res.ok) {
        router.push("/resources");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Save failed.");
        setBusy(false);
      }
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      {/* File / Lyrics tab toggle */}
      <div
        role="tablist"
        aria-label="Resource type"
        className="inline-flex bg-cream-100 p-1 rounded-full"
      >
        {(["FILE", "LYRICS"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              mode === m
                ? "bg-white text-sunrise-600 shadow-warm"
                : "text-ink-700 hover:text-ink-800"
            }`}
          >
            {m === "FILE" ? t("upload.tabFile") : t("upload.tabLyrics")}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="title" className="label">
          {t("upload.fieldTitle")}
        </label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          {t("upload.fieldDescription")}{" "}
          <span className="font-normal text-ink-700/60">{t("upload.optional")}</span>
        </label>
        <textarea
          id="description"
          className="input min-h-[80px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />
      </div>

      {mode === "FILE" ? (
        <div>
          <label htmlFor="file" className="label">
            {t("upload.fieldFile")}
          </label>
          <input
            id="file"
            type="file"
            accept={ACCEPT}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full
                       file:border-0 file:bg-sunrise-500 file:text-white file:font-semibold
                       hover:file:bg-sunrise-600"
          />
        </div>
      ) : (
        <div>
          <label htmlFor="lyrics" className="label">
            {t("upload.fieldLyrics")}
          </label>
          <textarea
            id="lyrics"
            className="input min-h-[280px] font-serif leading-relaxed"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            maxLength={20000}
            placeholder={t("upload.lyricsPlaceholder")}
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="uploaderName" className="label">
          {t("prayerForm.fieldName")}
        </label>
        <input
          id="uploaderName"
          className="input"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          maxLength={40}
          placeholder={t("prayerForm.namePlaceholder")}
          disabled={isAnonymous}
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-ink-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-cream-200 text-sunrise-500 focus:ring-sunrise-500"
          />
          {t("prayerForm.anonLabel")}{" "}
          <span className="font-semibold">{t("prayers.anon")}</span>)
        </label>
      </div>

      {error && <p className="text-sm text-berry-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <a href="/resources" className="btn-secondary">
          {t("upload.cancel")}
        </a>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? t("upload.submitting") : t("upload.submit")}
        </button>
      </div>
    </form>
  );
}
