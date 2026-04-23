import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { UploadForm } from "./UploadForm";

export default async function NewResourcePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="section-title">Share a worship resource</h1>
      <p className="text-ink-700/80 mt-2 mb-6">
        Upload a PDF (e.g. lyrics or chord sheets) or an image. Max 8 MB.
      </p>
      <UploadForm />
    </div>
  );
}
