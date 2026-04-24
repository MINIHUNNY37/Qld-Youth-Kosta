import { getSession } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getServerLang } from "@/lib/i18n-server";
import { NewPrayerForm } from "./NewPrayerForm";

export default async function NewPrayerPage() {
  const session = await getSession();
  const lang = getServerLang();

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="section-title">{t("prayerForm.title", lang)}</h1>
      <p className="text-ink-700/80 mt-2 mb-6">{t("prayerForm.intro", lang)}</p>
      <NewPrayerForm defaultName={session?.name ?? ""} />
    </div>
  );
}
