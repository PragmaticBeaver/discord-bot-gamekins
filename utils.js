export function convertPrice(ISOCode, numericPrice) {
  const price = parseInt(numericPrice) / 100;
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: ISOCode }).format(price);
}

export function convertDiscount(originalPrice, finalPrice) {
  const difference = finalPrice - originalPrice;
  const discount = Math.trunc((difference / originalPrice) * 100);
  return -discount;
}

export function buildChatOutput(games, header) {
  console.log(games);
  let content = `${header} \n\n`;
  games.forEach((g) => {
    const isoCode = g.currency;

    content = content.concat(`${g.name} \n`);

    if (g.finalPrice > 0) {
      // Paid games
      content = content.concat(`-${g.discountPercent}% ${convertPrice(isoCode, g.finalPrice)} \n`);
    } else {
      // Free games
      if (g.discountPercent > 0) {
        content = content.concat(`-${g.discountPercent}% Free \n`);
      } else {
        content = content.concat("Free\n");
      }
    }

    if (g.originalPrice) {
      content = content.concat(`Usual price ${convertPrice(isoCode, g.originalPrice)} \n`);
    }

    content = content.concat(`${g.storeUrl} \n`);
    content = content.concat("\n");
  });
  return content;
}

export function createGame(name, finalPrice, originalPrice, discountPercent, currency, storeUrl) {
  return { name, finalPrice, originalPrice, discountPercent, currency, storeUrl };
}