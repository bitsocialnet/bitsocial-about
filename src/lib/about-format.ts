import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLanguageCode } from "@/lib/locales";

/**
 * Spread on every element whose text or attributes come from these formatters. Browsers ship
 * different Intl data than Node (Safari writes Bengali and Marathi numbers in Latin digits,
 * Chrome has no Albanian data, month spellings vary), so the browser's first render can differ
 * from the server's. React then keeps the server's equally valid text instead of reporting a
 * hydration error.
 */
export const intlTextProps = { suppressHydrationWarning: true } as const;

function monthDate(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return Date.UTC(year, monthNumber - 1, 1);
}

/**
 * Number and month formatters for the active language; `YYYY-MM` months are read as UTC. Dates
 * use the Gregorian calendar in every language (Persian and Thai default to others) so months
 * agree with the years and days the page shows.
 */
export function useAboutFormatters() {
  const { i18n } = useTranslation();
  const locale = normalizeLanguageCode(i18n.resolvedLanguage ?? i18n.language);

  return useMemo(() => {
    const dateLocale = `${locale}-u-ca-gregory`;
    const numberFormat = new Intl.NumberFormat(locale);
    const yearFormat = new Intl.NumberFormat(locale, { useGrouping: false });
    const shortMonth = new Intl.DateTimeFormat(dateLocale, { month: "short", timeZone: "UTC" });
    const shortMonthYear = new Intl.DateTimeFormat(dateLocale, {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    const longMonthYear = new Intl.DateTimeFormat(dateLocale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });

    return {
      number: (value: number) => numberFormat.format(value),
      /** Years and days of the month, in the language's digits with no grouping. */
      year: (value: number | string) => yearFormat.format(Number(value)),
      shortMonth: (month: string) => shortMonth.format(monthDate(month)),
      shortMonthYear: (month: string) => shortMonthYear.format(monthDate(month)),
      longMonthYear: (month: string) => longMonthYear.format(monthDate(month)),
    };
  }, [locale]);
}
