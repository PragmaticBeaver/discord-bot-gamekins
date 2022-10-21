export function convertPrice(ISOCode, numericPrice) {
  const price = parseInt(numericPrice) / 100;
  return new Intl.NumberFormat(
    ISOCode === "EUR" ? "de-DE" : "en-US",
    { style: "currency", currency: ISOCode }
  ).format(price);
}

export function buildChatOutput(games, header) {
  let content = `${header} \n\n`;
  games.forEach((g) => {
    const isoCode = g.currency;

    content = content.concat(`${g.name} \n`);

    if (g.final_price > 0) {
      // Paid games
      content = content.concat(`-${g.discount_percent}% ${convertPrice(isoCode, g.final_price)} \n`);
    } else {
      // Free games
      if (g.discount_percent > 0) {
        content = content.concat(`-${g.discount_percent}% Free \n`);
      } else {
        content = content.concat("Free\n");
      }
    }

    if (g.original_price) {
      content = content.concat(`Usual price ${convertPrice(isoCode, g.original_price)} \n`);
    }

    content = content.concat(`${g.store_url} \n`);
    content = content.concat("\n");
  });
  return content;
}