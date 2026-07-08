const INDIAN_RUPEE_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return INDIAN_RUPEE_FORMATTER.format(rupees);
}
