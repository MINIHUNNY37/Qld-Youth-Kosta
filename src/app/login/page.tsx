import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="section-title text-center">Welcome back</h1>
      <p className="text-center text-ink-700/80 mt-2 mb-8">
        Sign in to share prayers and encourage others.
      </p>
      <LoginForm />
      <p className="text-center text-sm text-ink-700/80 mt-6">
        New here?{" "}
        <Link href="/register" className="text-sunrise-600 font-semibold underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
