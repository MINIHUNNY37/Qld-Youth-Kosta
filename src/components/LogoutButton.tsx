"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
    setLoading(false);
  }

  return (
    <button
      onClick={signOut}
      disabled={loading}
      className="btn-secondary !py-1.5 !px-4 text-sm"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
