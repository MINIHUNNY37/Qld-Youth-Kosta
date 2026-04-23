import { prisma } from "./prisma";
import { hashPassword } from "./auth";

// Ensures a bootstrap admin account exists on first run. Safe to call on every
// request — it short-circuits after the first successful creation.
let bootstrapped = false;

export async function ensureAdminBootstrap(): Promise<void> {
  if (bootstrapped) return;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "KOSTA Admin";

  if (!email || !password) {
    bootstrapped = true; // nothing to do; don't keep retrying
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await hashPassword(password),
        role: "ADMIN",
      },
    });
  } else if (existing.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: "ADMIN" },
    });
  }
  bootstrapped = true;
}
