import Link from "next/link";
import { formatDate } from "@/lib/format";

export type PrayerCardData = {
  id: string;
  title: string;
  content: string;
  createdAt: string | Date;
  author: { name: string };
  _count?: { comments: number };
};

export function PrayerCard({ note }: { note: PrayerCardData }) {
  return (
    <Link
      href={`/prayers/${note.id}`}
      className="card block hover:border-sunrise-400 transition-colors"
    >
      <div className="flex items-center gap-2 text-xs text-ink-700/70 mb-2">
        <span className="badge bg-cream-100 text-sunrise-600">Prayer</span>
        <span>{formatDate(note.createdAt)}</span>
        <span aria-hidden>·</span>
        <span>by {note.author.name}</span>
      </div>
      <h3 className="font-display text-2xl text-ink-800 leading-snug mb-2">
        {note.title}
      </h3>
      <p className="text-ink-700/90 line-clamp-3 whitespace-pre-line">
        {note.content}
      </p>
      {note._count && (
        <p className="mt-4 text-sm text-sunrise-600 font-semibold">
          {note._count.comments === 0
            ? "Be the first to encourage"
            : `${note._count.comments} ${
                note._count.comments === 1 ? "encouragement" : "encouragements"
              }`}
          &nbsp;→
        </p>
      )}
    </Link>
  );
}
