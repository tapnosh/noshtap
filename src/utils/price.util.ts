/**
 * Utility functions for formatting prices
 */

/**
 * Formats a price amount with currency symbol
 * @param amount - The price amount (can be Decimal, number, or string)
 * @param currency - ISO 4217 currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param locale - Optional locale string (defaults to 'en-US')
 * @returns Formatted price string (e.g., "$12.50", "€10.00")
 */
export function formatPrice(
  amount: number | string | { toString(): string },
  currency: string,
  locale: string = 'en-US',
): string {
  const numericAmount = typeof amount === 'object' && 'toString' in amount
    ? parseFloat(amount.toString())
    : typeof amount === 'string'
    ? parseFloat(amount)
    : amount;

  if (isNaN(numericAmount)) {
    throw new Error(`Invalid price amount: ${amount}`);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Formats a price object with amount and currency
 * @param price - Object with amount and currency
 * @param locale - Optional locale string (defaults to 'en-US')
 * @returns Formatted price string
 */
export function formatPriceObject(
  price: { amount: number | string | { toString(): string }; currency: string },
  locale?: string,
): string {
  return formatPrice(price.amount, price.currency, locale);
}

/**
 * Converts a Prisma Decimal to a number
 * @param decimal - Prisma Decimal value
 * @returns Number value
 */
export function decimalToNumber(decimal: { toString(): string } | number | string): number {
  if (typeof decimal === 'number') return decimal;
  if (typeof decimal === 'string') return parseFloat(decimal);
  return parseFloat(decimal.toString());
}





