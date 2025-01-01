import { calculateDiscount, createGame } from "./utils.js";

import fetch from "node-fetch";

export async function gatherEpicGamesFreebies(ISOcountryCode = "DE") {
  const locale = "de-DE";
  const freeGamesPromotionUrl = `https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=${locale}&country=${ISOcountryCode}`;
  const gameStorePageUrl = `https://store.epicgames.com/${ISOcountryCode}/p/`;

  let res;
  try {
    res = await (await fetch(freeGamesPromotionUrl)).json();
  } catch (err) {
    console.error(err);
    return;
  }

  const games = res?.data?.Catalog?.searchStore?.elements;
  // todo paging
  // const count = res?.data?.Catalog?.paging?.count;
  // const total = res?.data?.Catalog?.paging?.total;
  const freeGames = games.filter((g) => {
    if (
      (g.price.totalPrice.discount === g.price.totalPrice.originalPrice ||
        g.price.totalPrice.discountPrice === 0 ||
        g.price.totalPrice.originalPrice === 0) &&
      g.productSlug &&
      g.productSlug !== "[]" // upcoming mystery games may not have a slug
    ) {
      g.storeUrl = gameStorePageUrl + g.productSlug;
      return g;
    }
  });

  const formatedGames = convertGames(freeGames);
  // console.log({ formatedGames });
  return formatedGames;
}

function convertGames(games) {
  const formatedGames = [];
  games.forEach((g) => {
    if (g) {
      const discountedPrice = g.price.totalPrice.discountPrice;
      const originalPrice = g.price.totalPrice.originalPrice;

      const game = createGame(
        g.id,
        g.title,
        discountedPrice,
        originalPrice,
        calculateDiscount(originalPrice, discountedPrice),
        g.price.totalPrice.currencyCode,
        g.storeUrl
      );
      formatedGames.push(game);
    }
  });
  return formatedGames;
}
