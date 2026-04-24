import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// DELETE /api/resources/[id] — admin only (uploads are anonymous).
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const resource = await prisma.resource.findUnique({
    where: { id: params.id },
  });
  if (!resource) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner =
    !!resource.uploaderId && resource.uploaderId === session.sub;
  const isAdmin = session.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.resource.delete({ where: { id: params.id } });

  if (resource.fileUrl && process.env.BLOB_READ_WRITE_TOKEN) {
    del(resource.fileUrl, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(
      () => {}
    );
  }

  return NextResponse.json({ ok: true });
}
