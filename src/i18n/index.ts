import { createI18n } from "vue-i18n";
import es from "./es.json";
import en from "./en.json";
import de from "./de.json";

export type SupportedLocale = "es" | "en" | "de";

export const DEFAULT_LOCALE: SupportedLocale = "es";

const LOCALE_KEY = "alegra-locale";

function getInitialLocale(): SupportedLocale {
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored === "es" || stored === "en" || stored === "de") {
    return stored;
  }
  const browser = (navigator.language || "").slice(0, 2);
  if (browser === "en" || browser === "de") {
    return browser;
  }
  return DEFAULT_LOCALE;
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { es, en, de },
});

export function switchLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale;
  localStorage.setItem(LOCALE_KEY, locale);
  document.documentElement.setAttribute("lang", locale);
}

export default i18n;
