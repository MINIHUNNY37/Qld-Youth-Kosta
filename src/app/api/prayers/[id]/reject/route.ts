import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const note = await prisma.prayerNote.update({
      where: { id: params.id },
      data: { status: "REJECTED" },
    });
    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
