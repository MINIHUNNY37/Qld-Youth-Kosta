import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/prayers/[id] — fetch a single note with comments. Non-admins may
// only read APPROVED notes (plus their own drafts).
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  const note = await prisma.prayerNote.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true } } },
      },
    },
  });

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAdmin = session?.role === "ADMIN";
  const isAuthor = session?.sub === note.authorId;
  if (note.status !== "APPROVED" && !isAdmin && !isAuthor) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ note });
}

// DELETE /api/prayers/[id] — admin only.
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.prayerNote.delete({ where: { id: params.id } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
