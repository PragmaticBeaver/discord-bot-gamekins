import { calculateDiscount, createGame } from "./utils.js";

import fetch from "node-fetch";
import { find } from "lodash-es";

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
  const freeGames = games.filter((g) => {
    if (
      g.price.totalPrice.discount === g.price.totalPrice.originalPrice ||
      g.price.totalPrice.discountPrice === 0 ||
      g.price.totalPrice.originalPrice === 0
    ) {
      const gameMap = find(g.catalogNs.mappings, (m) => {
        if (m.pageSlug) {
          return m;
        }
      });
      if (!gameMap) return;

      g.storeUrl = gameStorePageUrl + gameMap.pageSlug;
      return g;
    }
  });

  const formatedGames = convertGames(freeGames);
  console.log({ formatedGames });
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
