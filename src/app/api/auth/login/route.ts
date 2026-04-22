import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { ensureAdminBootstrap } from "@/lib/bootstrap";

export async function POST(req: Request) {
  await ensureAdminBootstrap();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Uniform response to avoid user enumeration.
  const invalid = NextResponse.json(
    { error: "Incorrect email or password." },
    { status: 401 }
  );
  if (!user) return invalid;
  if (!(await verifyPassword(password, user.passwordHash))) return invalid;

  await setSessionCookie({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
