import { pesosToCentavos } from "./currency";

export function appendDigit(value: string, digit: string): string {
  const dotIndex = value.indexOf(".");
  if (dotIndex !== -1 && value.length - dotIndex > 2) return value;

  if (value === "0" && digit !== ".") return digit;
  if (value === "" && digit === "0") return "0";

  return value + digit;
}

export function appendDecimal(value: string): string {
  if (value.includes(".")) return value;
  if (value === "") return "0.";
  return value + ".";
}

export function backspace(value: string): string {
  if (value.length <= 1) return "";
  return value.slice(0, -1);
}

export function amountStringToCentavos(value: string): number {
  const pesos = parseFloat(value || "0");
  if (isNaN(pesos)) return 0;
  return pesosToCentavos(pesos);
}

export function formatAmountString(value: string): string {
  if (!value || value === "0") return "0";

  const dotIndex = value.indexOf(".");
  const intPart = dotIndex !== -1 ? value.slice(0, dotIndex) : value;
  const decPart = dotIndex !== -1 ? value.slice(dotIndex) : "";

  const intFormatted = parseInt(intPart || "0", 10).toLocaleString("en-PH");
  return intFormatted + decPart;
}
