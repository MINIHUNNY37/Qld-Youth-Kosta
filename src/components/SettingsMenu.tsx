"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLang } from "./LanguageProvider";
import type { Lang } from "@/lib/i18n";

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
};

export function SettingsMenu({ isSignedIn }: { isSignedIn: boolean }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-2 hover:bg-cream-100 transition-colors"
        aria-label={t("nav.settings")}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-ink-700"
          aria-hidden
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-cream-200 shadow-warm py-2 z-40"
        >
          <p className="px-4 pt-1 pb-2 text-xs uppercase tracking-wide text-ink-700/60">
            {t("nav.language")}
          </p>
          {(["en", "ko"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              role="menuitemradio"
              aria-checked={lang === opt}
              onClick={() => setLang(opt)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-cream-100 flex items-center justify-between ${
                lang === opt ? "font-semibold text-sunrise-600" : "text-ink-700"
              }`}
            >
              <span>{LANG_LABELS[opt]}</span>
              {lang === opt && (
                <span aria-hidden className="text-sunrise-600">✓</span>
              )}
            </button>
          ))}

          {!isSignedIn && (
            <>
              <div className="my-1 border-t border-cream-200" />
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-ink-700 hover:bg-cream-100"
              >
                {t("nav.adminSignIn")}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
