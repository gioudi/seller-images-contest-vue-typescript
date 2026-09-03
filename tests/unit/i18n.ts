import { createI18n } from "vue-i18n";
import es from "@/i18n/es.json";
import en from "@/i18n/en.json";
import de from "@/i18n/de.json";

export function createTestI18n(locale: string = "es") {
  return createI18n({
    legacy: false,
    globalInjection: true,
    locale,
    fallbackLocale: "es",
    messages: { es, en, de },
  });
}
