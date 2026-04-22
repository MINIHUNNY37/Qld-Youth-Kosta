import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="font-display text-5xl text-sunrise-600 mb-3">404</h1>
      <p className="text-ink-700 mb-6">We couldn&rsquo;t find that page.</p>
      <Link href="/" className="btn-primary">
        Back home
      </Link>
    </div>
  );
}
