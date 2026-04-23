import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/prayers/[id]/heart — increment heart counter.
// Spam-prevention is handled client-side via localStorage.
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const note = await prisma.prayerNote.findUnique({
    where: { id: params.id },
    select: { id: true, status: true },
  });

  if (!note || note.status !== "APPROVED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.prayerNote.update({
    where: { id: params.id },
    data: { heartCount: { increment: 1 } },
    select: { heartCount: true },
  });

  return NextResponse.json({ heartCount: updated.heartCount });
}
