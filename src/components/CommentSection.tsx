"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDateTime } from "@/lib/format";

type Comment = {
  id: string;
  content: string;
  createdAt: string | Date;
  author: { id: string; name: string };
};

export function CommentSection({
  prayerId,
  initialComments,
  currentUserId,
  isAdmin,
  isSignedIn,
}: {
  prayerId: string;
  initialComments: Comment[];
  currentUserId: string | null;
  isAdmin: boolean;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    setError(null);

    const res = await fetch(`/api/prayers/${prayerId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const { comment } = await res.json();
      setComments((list) => [...list, comment]);
      setContent("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not post your comment.");
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((list) => list.filter((c) => c.id !== id));
      router.refresh();
    } else {
      alert("Could not delete comment.");
    }
  }

  return (
    <section className="mt-10">
      <h2 className="section-title !text-2xl mb-4">Encouragements</h2>

      {comments.length === 0 ? (
        <p className="text-ink-700/70 italic mb-6">
          No encouragements yet. Be the first to pray with this person.
        </p>
      ) : (
        <ul className="space-y-4 mb-6">
          {comments.map((c) => {
            const canDelete = isAdmin || c.author.id === currentUserId;
            return (
              <li key={c.id} className="card !p-5">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="font-semibold text-ink-800">
                    {c.author.name}
                  </span>
                  <span className="text-xs text-ink-700/60">
                    {formatDateTime(c.createdAt)}
                  </span>
                </div>
                <p className="text-ink-700/90 whitespace-pre-line">
                  {c.content}
                </p>
                {canDelete && (
                  <button
                    onClick={() => remove(c.id)}
                    className="mt-3 text-sm text-berry-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isSignedIn ? (
        <form onSubmit={submit} className="card">
          <label htmlFor="comment" className="label">
            Leave an encouragement
          </label>
          <textarea
            id="comment"
            className="input min-h-[110px]"
            placeholder="A short prayer or word of encouragement…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            required
          />
          {error && (
            <p className="mt-2 text-sm text-berry-600">{error}</p>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={busy || !content.trim()}
              className="btn-primary"
            >
              {busy ? "Posting…" : "Post encouragement"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-ink-700/80">
          <a className="text-sunrise-600 font-semibold underline" href="/login">
            Sign in
          </a>{" "}
          to leave an encouragement.
        </p>
      )}
    </section>
  );
}
