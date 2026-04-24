"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang, Key } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

type Dict = Record<Lang, Record<Key, string>>;

export function LanguageProvider({
  initialLang,
  dict,
  children,
}: {
  initialLang: Lang;
  dict: Dict;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
    document.cookie = `kosta_lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    // Reload so server components re-render with the new language.
    if (typeof window !== "undefined") window.location.reload();
  }

  function t(k: Key) {
    return dict[lang]?.[k] ?? dict.en[k];
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used inside <LanguageProvider>");
  }
  return ctx;
}
