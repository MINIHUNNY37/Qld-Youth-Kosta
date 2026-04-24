import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { commentSchema } from "@/lib/validations";

// POST /api/prayers/[id]/comments — add a comment to an APPROVED note.
// Anonymous-friendly: no sign-in required.
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const note = await prisma.prayerNote.findUnique({ where: { id: params.id } });
  if (!note || note.status !== "APPROVED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { content, authorName, isAnonymous } = parsed.data;

  const resolvedName =
    (authorName && authorName.length > 0 ? authorName : session?.name) ?? "Anon";

  const comment = await prisma.comment.create({
    data: {
      content,
      isAnonymous: !!isAnonymous,
      authorName: isAnonymous ? "Anon" : resolvedName,
      authorId: session?.sub ?? null,
      prayerNoteId: note.id,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ comment });
}
