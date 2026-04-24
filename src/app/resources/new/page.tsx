import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getServerLang } from "@/lib/i18n-server";
import { UploadForm } from "./UploadForm";

export default async function NewResourcePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const lang = getServerLang();

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="section-title">{t("upload.title", lang)}</h1>
      <p className="text-ink-700/80 mt-2 mb-6">{t("upload.intro", lang)}</p>
      <UploadForm />
    </div>
  );
}
