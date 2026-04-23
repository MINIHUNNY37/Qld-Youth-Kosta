"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";

export type PrayerCardData = {
  id: string;
  title: string;
  content: string;
  createdAt: string | Date;
  isAnonymous: boolean;
  authorName: string;
  prayedCount: number;
  heartCount: number;
};

const STICKY_BACKGROUNDS = [
  "bg-sticky-peach",
  "bg-sticky-cream",
  "bg-sticky-mint",
  "bg-sticky-lilac",
  "bg-sticky-sky",
];

const ROTATIONS = ["-rotate-2", "-rotate-1", "rotate-0", "rotate-1", "rotate-2"];

// Stable hash so the same note always gets the same colour + tilt.
function indexFromId(id: string, max: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % max;
}

export function PrayerCard({ note }: { note: PrayerCardData }) {
  const bg = STICKY_BACKGROUNDS[indexFromId(note.id, STICKY_BACKGROUNDS.length)];
  const tilt = ROTATIONS[indexFromId(note.id + "x", ROTATIONS.length)];

  const [prayed, setPrayed] = useState(note.prayedCount);
  const [hearts, setHearts] = useState(note.heartCount);
  const [didPray, setDidPray] = useState(false);
  const [didHeart, setDidHeart] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDidPray(localStorage.getItem(`prayed:${note.id}`) === "1");
    setDidHeart(localStorage.getItem(`hearted:${note.id}`) === "1");
  }, [note.id]);

  async function handlePray(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (didPray || busy) return;
    setBusy(true);
    setPrayed((c) => c + 1);
    setDidPray(true);
    localStorage.setItem(`prayed:${note.id}`, "1");
    try {
      const res = await fetch(`/api/prayers/${note.id}/pray`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.prayedCount === "number") setPrayed(data.prayedCount);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleHeart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (didHeart || busy) return;
    setBusy(true);
    setHearts((c) => c + 1);
    setDidHeart(true);
    localStorage.setItem(`hearted:${note.id}`, "1");
    try {
      const res = await fetch(`/api/prayers/${note.id}/heart`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.heartCount === "number") setHearts(data.heartCount);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`relative pt-5 ${tilt} transition-transform hover:rotate-0 hover:-translate-y-1`}>
      {/* Tape */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-6 rounded-sm bg-tape-amber/70 shadow-sm"
        style={{ clipPath: "polygon(6% 0, 94% 0, 100% 100%, 0 100%)" }}
      />

      <Link
        href={`/prayers/${note.id}`}
        className={`block ${bg} rounded-md shadow-sticky p-5 pt-6 min-h-[220px]`}
      >
        <div className="flex items-center gap-2 text-xs text-ink-700/70 mb-3">
          {note.isAnonymous ? (
            <span className="badge bg-white/70 text-ink-700">
              <span aria-hidden className="mr-1">🕊️</span>
              익명 · Anon
            </span>
          ) : (
            <span className="badge bg-white/70 text-ink-700">
              by {note.authorName}
            </span>
          )}
          <span className="ml-auto">{formatDate(note.createdAt)}</span>
        </div>

        <h3 className="font-display text-2xl text-ink-800 leading-snug mb-2">
          {note.title}
        </h3>
        <p className="text-ink-700/90 line-clamp-4 whitespace-pre-line">
          {note.content}
        </p>
      </Link>

      {/* Action row (sits visually inside the sticky note) */}
      <div className={`-mt-1 mx-1 ${bg} rounded-b-md px-5 pb-4 pt-2 flex items-center justify-between`}>
        <button
          onClick={handlePray}
          disabled={didPray || busy}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-3 py-1.5 transition-colors ${
            didPray
              ? "bg-sunrise-500 text-white cursor-default"
              : "bg-white/80 text-ink-700 hover:bg-white"
          }`}
          aria-label="I prayed for this"
        >
          <span aria-hidden>🙏</span>
          {didPray ? "Prayed" : "I prayed"}
          {prayed > 0 && <span className="opacity-80">· {prayed}</span>}
        </button>

        <button
          onClick={handleHeart}
          disabled={didHeart || busy}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-3 py-1.5 transition-colors ${
            didHeart
              ? "bg-berry-500 text-white cursor-default"
              : "bg-white/80 text-ink-700 hover:bg-white"
          }`}
          aria-label="Send a heart"
        >
          <span aria-hidden>{didHeart ? "❤️" : "🤍"}</span>
          {hearts}
        </button>
      </div>
    </div>
  );
}
