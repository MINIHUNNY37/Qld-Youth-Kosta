import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PrayerCard } from "@/components/PrayerCard";

export const dynamic = "force-dynamic";

export default async function PrayersPage() {
  const notes = await prisma.prayerNote.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Prayer notes</h1>
          <p className="text-ink-700/80 mt-1 max-w-2xl">
            Every note you see here has been approved by an admin. Tap{" "}
            <span className="font-semibold">I prayed</span> after praying, or
            send a heart of encouragement.
          </p>
        </div>
        <Link href="/prayers/new" className="btn-primary whitespace-nowrap">
          + Share a prayer
        </Link>
      </div>

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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <PrayerCard
              key={n.id}
              note={{
                id: n.id,
                title: n.title,
                content: n.content,
                createdAt: n.createdAt,
                isAnonymous: n.isAnonymous,
                authorName: n.authorName,
                prayedCount: n.prayedCount,
                heartCount: n.heartCount,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
