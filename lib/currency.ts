export const SUPPORTED_CURRENCIES = [
  { code: "PHP", label: "₱ Philippine Peso", locale: "en-PH" },
  { code: "USD", label: "$ US Dollar", locale: "en-US" },
  { code: "EUR", label: "€ Euro", locale: "de-DE" },
] as const;

const LOCALE_MAP: Record<string, string> = {
  PHP: "en-PH",
  USD: "en-US",
  EUR: "de-DE",
};

export function formatCurrency(centavos: number, currency: string = "PHP"): string {
  return new Intl.NumberFormat(LOCALE_MAP[currency] ?? "en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(centavos / 100);
}

export const formatPeso = formatCurrency;

export function pesosToCentavos(pesos: number): number {
  return Math.round(pesos * 100);
}

export function centavosToPesos(centavos: number): number {
  return centavos / 100;
}
