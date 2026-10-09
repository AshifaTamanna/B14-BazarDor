import type { Product } from "@/types/bazar";

const bengaliNumber = new Intl.NumberFormat("bn-BD");
const bengaliDecimal = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const unitLabels: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  ltr: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
};

export function formatPrice(value: number) {
  return bengaliNumber.format(value);
}

export function formatUnit(unit: string) {
  return unitLabels[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

export function formatChange(product: Product) {
  const { dir, pct } = product.change;

  if (dir === "flat") {
    return "— ০.০%";
  }

  const arrow = dir === "up" ? "▲" : "▼";
  return `${arrow} ${bengaliDecimal.format(Math.abs(pct))}%`;
}

export function getPriceSummary(product: Product) {
  const marketPrices = product.markets.flatMap(({ min, max }) => [min, max]);
  const min = Math.min(...marketPrices);
  const max = Math.max(...marketPrices);
  const average = Math.round(
    marketPrices.reduce((total, price) => total + price, 0) /
      marketPrices.length,
  );

  return { min, max, average };
}
