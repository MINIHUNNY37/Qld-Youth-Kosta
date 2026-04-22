"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ACCEPT = "application/pdf,image/png,image/jpeg,image/gif,image/webp";
const MAX_MB = 8;

export function UploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large (max ${MAX_MB} MB).`);
      return;
    }
    setBusy(true);
    setError(null);

    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", description);
    fd.set("file", file);

    const res = await fetch("/api/resources", { method: "POST", body: fd });
    if (res.ok) {
      router.push("/resources");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Upload failed.");
      setBusy(false);
    }
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
          maxLength={150}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="label">
          Description <span className="font-normal text-ink-700/60">(optional)</span>
        </label>
        <textarea
          id="description"
          className="input min-h-[90px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />
      </div>
      <div>
        <label htmlFor="file" className="label">
          File (PDF or image, max {MAX_MB} MB)
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
      {error && <p className="text-sm text-berry-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <a href="/resources" className="btn-secondary">Cancel</a>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
