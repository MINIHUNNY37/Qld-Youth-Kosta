import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CommentSection } from "@/components/CommentSection";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PrayerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const note = await prisma.prayerNote.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!note) notFound();

  const isAdmin = session?.role === "ADMIN";
  const isAuthor = !!note.authorId && session?.sub === note.authorId;
  if (note.status !== "APPROVED" && !isAdmin && !isAuthor) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link
        href="/prayers"
        className="text-sunrise-600 font-semibold hover:underline"
      >
        ← All prayer notes
      </Link>

      <article className="mt-6">
        <div className="flex items-center gap-2 text-sm text-ink-700/80 mb-3">
          <span className="badge bg-sunrise-500/15 text-sunrise-600">
            {note.status}
          </span>
          <span>{formatDate(note.createdAt)}</span>
          <span aria-hidden>·</span>
          <span>
            {note.isAnonymous ? "익명 · Anon" : `by ${note.authorName}`}
          </span>
        </div>
        <h1 className="font-display text-4xl text-ink-800 leading-tight mb-5">
          {note.title}
        </h1>
        <div className="card">
          <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-ink-800">
            {note.content}
          </p>
          <div className="mt-5 pt-4 border-t border-cream-200 flex items-center gap-4 text-sm text-ink-700/80">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>🙏</span>
              {note.prayedCount} prayed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>❤️</span>
              {note.heartCount}
            </span>
          </div>
        </div>
      </article>

      {note.status === "APPROVED" ? (
        <CommentSection
          prayerId={note.id}
          initialComments={note.comments.map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
            authorName: c.authorName,
            isAnonymous: c.isAnonymous,
          }))}
          isAdmin={!!isAdmin}
          defaultName={session?.name ?? ""}
        />
      ) : (
        <p className="mt-8 text-ink-700/70 italic">
          Comments open once this prayer is approved.
        </p>
      )}
    </div>
  );
}
