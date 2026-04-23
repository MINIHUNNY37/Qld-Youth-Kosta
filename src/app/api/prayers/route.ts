import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { prayerNoteSchema } from "@/lib/validations";

// GET /api/prayers — list prayer notes.
// Normal users see only APPROVED notes. Admins may pass ?status=PENDING etc.
export async function GET(req: Request) {
  const session = await getSession();
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");

  const statusFilter =
    statusParam && session?.role === "ADMIN"
      ? statusParam.toUpperCase()
      : "APPROVED";

  if (!["PENDING", "APPROVED", "REJECTED"].includes(statusFilter)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const notes = await prisma.prayerNote.findMany({
    where: { status: statusFilter },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
  });

  return NextResponse.json({ notes });
}

// POST /api/prayers — anyone may submit (signed-in or anonymous). Lands in PENDING.
export async function POST(req: Request) {
  const session = await getSession();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = prayerNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, content, isAnonymous, authorName } = parsed.data;

  // Resolve display name: signed-in user's name, or provided name, or "Anon".
  const resolvedName =
    (authorName && authorName.length > 0 ? authorName : session?.name) ?? "Anon";

  const note = await prisma.prayerNote.create({
    data: {
      title,
      content,
      isAnonymous: !!isAnonymous,
      authorName: isAnonymous ? "Anon" : resolvedName,
      authorId: session?.sub ?? null,
      status: "PENDING",
    },
  });

  return NextResponse.json({ note });
}
