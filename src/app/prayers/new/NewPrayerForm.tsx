"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewPrayerForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
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
          Thank you 🙏
        </h2>
        <p className="text-ink-700">
          Your prayer has been submitted and is awaiting admin approval. It will
          appear publicly once approved.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={() => setDone(false)} className="btn-secondary">
            Share another
          </button>
          <a href="/prayers" className="btn-primary">
            Back to prayers
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div>
        <label htmlFor="title" className="label">
          Title
        </label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
          placeholder="e.g. Family conflict at home"
        />
      </div>

      <div>
        <label htmlFor="content" className="label">
          What would you like us to pray for?
        </label>
        <textarea
          id="content"
          className="input min-h-[180px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={4000}
          required
          placeholder="Share as much or as little as you like."
        />
      </div>

      <div>
        <label htmlFor="authorName" className="label">
          Your name (optional)
        </label>
        <input
          id="authorName"
          className="input"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={40}
          placeholder="e.g. Hannah"
          disabled={isAnonymous}
        />
        <label className="mt-3 flex items-center gap-2 text-sm text-ink-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-cream-200 text-sunrise-500 focus:ring-sunrise-500"
          />
          Post anonymously (shown as <span className="font-semibold">익명 · Anon</span>)
        </label>
      </div>

      {error && <p className="text-sm text-berry-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <a href="/prayers" className="btn-secondary">
          Cancel
        </a>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Submitting…" : "Submit for approval"}
        </button>
      </div>
    </form>
  );
}
