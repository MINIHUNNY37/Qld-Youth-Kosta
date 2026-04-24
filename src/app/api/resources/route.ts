import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  ALLOWED_MIME,
  AllowedMime,
  MAX_UPLOAD_BYTES,
  resourceMetaSchema,
  lyricsResourceSchema,
} from "@/lib/validations";

export async function GET() {
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    include: { uploader: { select: { id: true, name: true } } },
  });
  return NextResponse.json({ resources });
}

export async function POST(req: Request) {
  const session = await getSession();
  const ctype = req.headers.get("content-type") ?? "";

  // Branch 1 — JSON payload = lyrics-only resource.
  if (ctype.includes("application/json")) {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = lyricsResourceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const resolvedName =
      (parsed.data.uploaderName && parsed.data.uploaderName.length > 0
        ? parsed.data.uploaderName
        : session?.name) ?? "Anon";

    const resource = await prisma.resource.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        fileType: "LYRICS",
        lyrics: parsed.data.lyrics,
        isAnonymous: !!parsed.data.isAnonymous,
        uploaderName: parsed.data.isAnonymous ? "Anon" : resolvedName,
        uploaderId: session?.sub ?? null,
      },
      include: { uploader: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ resource });
  }

  // Branch 2 — multipart file upload (PDF / image) → Vercel Blob.
  const form = await req.formData();
  const file = form.get("file");
  const title = form.get("title");
  const description = form.get("description");
  const uploaderName = form.get("uploaderName");
  const isAnonymous = form.get("isAnonymous") === "true";

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
    uploaderName: typeof uploaderName === "string" ? uploaderName : undefined,
    isAnonymous,
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

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "File storage is not configured. Connect a Vercel Blob store and set BLOB_READ_WRITE_TOKEN.",
      },
      { status: 500 }
    );
  }

  const blob = await put(`resources/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const resolvedName =
    (meta.data.uploaderName && meta.data.uploaderName.length > 0
      ? meta.data.uploaderName
      : session?.name) ?? "Anon";

  const resource = await prisma.resource.create({
    data: {
      title: meta.data.title,
      description: meta.data.description,
      fileUrl: blob.url,
      fileName: file.name,
      fileType: resourceType,
      isAnonymous: !!meta.data.isAnonymous,
      uploaderName: meta.data.isAnonymous ? "Anon" : resolvedName,
      uploaderId: session?.sub ?? null,
    },
    include: { uploader: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ resource });
}
