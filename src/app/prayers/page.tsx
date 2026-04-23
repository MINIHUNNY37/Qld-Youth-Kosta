import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { PrayerCard } from "@/components/PrayerCard";

export const dynamic = "force-dynamic";

export default async function PrayersPage() {
  const session = await getSession();
  const notes = await prisma.prayerNote.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Prayer notes</h1>
          <p className="text-ink-700/80 mt-1 max-w-2xl">
            Every note you see here has been approved by an admin. Read, pray,
            and leave a word of encouragement.
          </p>
        </div>
        <Link href="/prayers/new" className="btn-primary whitespace-nowrap">
          + Share a prayer
        </Link>
      </div>

      {!session && (
        <div className="card mb-6 bg-cream-100">
          <p className="text-ink-700">
            <Link href="/login" className="text-sunrise-600 font-semibold underline">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href="/register" className="text-sunrise-600 font-semibold underline">
              create an account
            </Link>{" "}
            to submit your own prayer or leave encouragements.
          </p>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="card text-center">
          <p className="text-ink-700/80 text-lg">
            No approved prayer notes yet. Be the first to share one.
          </p>
          <div className="mt-4">
            <Link href="/prayers/new" className="btn-primary">
              Share the first prayer
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <PrayerCard
              key={n.id}
              note={{
                id: n.id,
                title: n.title,
                content: n.content,
                createdAt: n.createdAt,
                author: { name: n.author.name },
                _count: n._count,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
