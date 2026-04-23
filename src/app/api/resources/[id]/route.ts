import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// DELETE /api/resources/[id] — uploader or admin.
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

  const isOwner = resource.uploaderId === session.sub;
  const isAdmin = session.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.resource.delete({ where: { id: params.id } });

  // Best-effort cleanup of the stored file. Ignore errors (missing file, etc.)
  const diskPath = path.join(process.cwd(), "public", resource.fileUrl);
  unlink(diskPath).catch(() => {});

  return NextResponse.json({ ok: true });
}
