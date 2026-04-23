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
    where: { status: statusFilter as "PENDING" | "APPROVED" | "REJECTED" },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
  });

  return NextResponse.json({ notes });
}

// POST /api/prayers — any signed-in user may submit. Lands in PENDING.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

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

  const note = await prisma.prayerNote.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      authorId: session.sub,
      status: "PENDING",
    },
  });

  return NextResponse.json({ note });
}
