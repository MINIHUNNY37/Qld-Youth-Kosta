import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="section-title text-center">Join the community</h1>
      <p className="text-center text-ink-700/80 mt-2 mb-8">
        Create an account to share prayers, encourage others, and upload worship resources.
      </p>
      <RegisterForm />
      <p className="text-center text-sm text-ink-700/80 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-sunrise-600 font-semibold underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
