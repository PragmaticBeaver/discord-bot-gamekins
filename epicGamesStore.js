import fetch from "node-fetch";
import { find } from "lodash-es";

import { createGame, convertDiscount } from "./utils.js";

// const apiUrl = "https://store-content.ak.epicgames.com";
// /content/productmapping => product mapping
// /content/products/{slug} => product
// /content/store => store
// 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale={}&country={}&allowCountries={}' => free games

// const FREE_URL = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=de-DE&country=DE";

export async function gatherEpicGamesFreebies(ISOcountryCode) {
  const locale = "en-US";
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
    // todo filter by price
    const gameMap = find(g.catalogNs.mappings, (m) => {
      if (m.pageSlug) {
        return m;
      }
    });
    if (!gameMap) return;

    g.storeUrl = gameStorePageUrl + gameMap.pageSlug;
    return g;
  });

  const formatedGames = convertGames(freeGames);
  console.log(formatedGames);
  return formatedGames;
}

function convertGames(games) {
  const formatedGames = [];
  games.forEach((g) => {
    if (g) {
      const discountedPrice = g.price.totalPrice.discountPrice;
      const originalPrice = g.price.totalPrice.originalPrice;

      const game = createGame(
        g.title,
        discountedPrice,
        originalPrice,
        convertDiscount(originalPrice, discountedPrice),
        g.price.totalPrice.currencyCode,
        g.storeUrl
      );
      formatedGames.push(game);
    }
  });
  return formatedGames;
}
