import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { NewPrayerForm } from "./NewPrayerForm";

export default async function NewPrayerPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="section-title">Share a prayer</h1>
      <p className="text-ink-700/80 mt-2 mb-6">
        Your note will be reviewed by an admin before it appears publicly. Thank
        you for trusting us with it.
      </p>
      <NewPrayerForm />
    </div>
  );
}
