import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getServerLang } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { LogoutButton } from "./LogoutButton";
import { SettingsMenu } from "./SettingsMenu";

export async function Navbar() {
  const session = await getSession();
  const lang = getServerLang();

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-cream-50/85 border-b border-cream-200">
      <nav className="mx-auto max-w-6xl flex flex-wrap items-center gap-4 px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl text-ink-800"
        >
          <span
            aria-hidden
            className="inline-block h-8 w-8 rounded-full bg-sunrise-500 text-white grid place-items-center text-sm font-bold shadow-warm"
          >
            K
          </span>
          <span>QLD Youth KOSTA</span>
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 text-[15px] font-medium text-ink-700">
          <NavLink href="/prayers">{t("nav.prayers", lang)}</NavLink>
          <NavLink href="/resources">{t("nav.worship", lang)}</NavLink>
          {session?.role === "ADMIN" && (
            <NavLink href="/admin">{t("nav.admin", lang)}</NavLink>
          )}
          {session ? (
            <div className="flex items-center gap-2 pl-2">
              <span className="hidden sm:inline text-sm text-ink-700/80">
                {t("nav.hi", lang)} {session.name}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1">
              <Link href="/login" className="btn-secondary !py-1.5 !px-4 text-sm">
                {t("nav.signIn", lang)}
              </Link>
              <Link href="/register" className="btn-primary !py-1.5 !px-4 text-sm">
                {t("nav.join", lang)}
              </Link>
            </div>
          )}
          <SettingsMenu />
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-1.5 hover:bg-cream-100 transition-colors"
    >
      {children}
    </Link>
  );
}
