export function convertPrice(ISOCode, numericPrice) {
  const price = parseInt(numericPrice) / 100;
  return new Intl.NumberFormat(
    ISOCode === "EUR" ? "de-DE" : "en-US",
    { style: "currency", currency: ISOCode }
  ).format(price);
}
