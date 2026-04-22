import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  ALLOWED_MIME,
  AllowedMime,
  MAX_UPLOAD_BYTES,
  resourceMetaSchema,
} from "@/lib/validations";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function safeExt(name: string): string {
  const ext = path.extname(name).toLowerCase();
  return /^\.[a-z0-9]{1,8}$/.test(ext) ? ext : "";
}

export async function GET() {
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    include: { uploader: { select: { id: true, name: true } } },
  });
  return NextResponse.json({ resources });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const title = form.get("title");
  const description = form.get("description");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB)` },
      { status: 413 }
    );
  }

  const meta = resourceMetaSchema.safeParse({
    title: typeof title === "string" ? title : "",
    description: typeof description === "string" ? description : undefined,
  });
  if (!meta.success) {
    return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
  }

  const mime = file.type as AllowedMime;
  const resourceType = ALLOWED_MIME[mime];
  if (!resourceType) {
    return NextResponse.json(
      { error: "Only PDF and image files are allowed." },
      { status: 415 }
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = safeExt(file.name) || (mime === "application/pdf" ? ".pdf" : "");
  const storedName = `${randomUUID()}${ext}`;
  const diskPath = path.join(UPLOAD_DIR, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(diskPath, buffer);

  const resource = await prisma.resource.create({
    data: {
      title: meta.data.title,
      description: meta.data.description,
      fileUrl: `/uploads/${storedName}`,
      fileName: file.name,
      fileType: resourceType,
      uploaderId: session.sub,
    },
    include: { uploader: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ resource });
}
