"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminActions({
  prayerId,
  showApprove,
  showReject,
  showDelete,
}: {
  prayerId: string;
  showApprove?: boolean;
  showReject?: boolean;
  showDelete?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function call(path: string, method: "POST" | "DELETE", confirmMsg?: string) {
    if (confirmMsg && !confirm(confirmMsg)) return;
    setBusy(path);
    const res = await fetch(path, { method });
    setBusy(null);
    if (res.ok) router.refresh();
    else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {showApprove && (
        <button
          className="btn-primary !py-1.5 !px-4 text-sm"
          disabled={busy !== null}
          onClick={() => call(`/api/prayers/${prayerId}/approve`, "POST")}
        >
          {busy?.endsWith("/approve") ? "…" : "Approve"}
        </button>
      )}
      {showReject && (
        <button
          className="btn-secondary !py-1.5 !px-4 text-sm"
          disabled={busy !== null}
          onClick={() => call(`/api/prayers/${prayerId}/reject`, "POST")}
        >
          {busy?.endsWith("/reject") ? "…" : "Reject"}
        </button>
      )}
      {showDelete && (
        <button
          className="btn-danger !py-1.5 !px-4 text-sm"
          disabled={busy !== null}
          onClick={() =>
            call(
              `/api/prayers/${prayerId}`,
              "DELETE",
              "Permanently delete this prayer note?"
            )
          }
        >
          {busy === `/api/prayers/${prayerId}` ? "…" : "Delete"}
        </button>
      )}
    </div>
  );
}
