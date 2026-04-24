"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";

export function NewPrayerForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const { t } = useLang();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState(defaultName);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/prayers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        authorName: isAnonymous ? undefined : authorName,
        isAnonymous,
      }),
    });
    if (res.ok) {
      setDone(true);
      setTitle("");
      setContent("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not submit prayer.");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="card text-center">
        <h2 className="font-display text-2xl text-sunrise-600 mb-2">
          {t("prayerForm.thanks")}
        </h2>
        <p className="text-ink-700">{t("prayerForm.thanksBody")}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={() => setDone(false)} className="btn-secondary">
            {t("prayerForm.another")}
          </button>
          <a href="/prayers" className="btn-primary">
            {t("prayerForm.back")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div>
        <label htmlFor="title" className="label">
          {t("prayerForm.fieldTitle")}
        </label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
          placeholder={t("prayerForm.titlePlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="content" className="label">
          {t("prayerForm.fieldContent")}
        </label>
        <textarea
          id="content"
          className="input min-h-[180px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={4000}
          required
          placeholder={t("prayerForm.contentPlaceholder")}
        />
      </div>

      <div>
        <label htmlFor="authorName" className="label">
          {t("prayerForm.fieldName")}
        </label>
        <input
          id="authorName"
          className="input"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={40}
          placeholder={t("prayerForm.namePlaceholder")}
          disabled={isAnonymous}
        />
        <label className="mt-3 flex items-center gap-2 text-sm text-ink-700 cursor-pointer select-none">
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
        <a href="/prayers" className="btn-secondary">
          {t("prayerForm.cancel")}
        </a>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? t("prayerForm.submitting") : t("prayerForm.submit")}
        </button>
      </div>
    </form>
  );
}
