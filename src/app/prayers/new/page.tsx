import { getSession } from "@/lib/auth";
import { NewPrayerForm } from "./NewPrayerForm";

export default async function NewPrayerPage() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="section-title">Share a prayer</h1>
      <p className="text-ink-700/80 mt-2 mb-6">
        You don&apos;t need an account to share a prayer. Choose to share your name
        or stay anonymous — your note will be reviewed by an admin before it
        appears publicly.
      </p>
      <NewPrayerForm defaultName={session?.name ?? ""} />
    </div>
  );
}
