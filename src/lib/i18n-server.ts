import { cookies } from "next/headers";
import type { Lang } from "./i18n";
import { LANG_COOKIE } from "./i18n";

export function getServerLang(): Lang {
  const c = cookies().get(LANG_COOKIE)?.value;
  return c === "ko" ? "ko" : "en";
}
