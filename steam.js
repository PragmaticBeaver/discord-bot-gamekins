import fetch from "node-fetch";

const FEATURED_GAMES = "http://store.steampowered.com/api/featured/?l=english";
const FEATURED_CATEGORIES = "http://store.steampowered.com/api/featuredcategories/?l=english";

export async function gatherSteamDeals() {
  const games = [].concat(await gatherFeaturedCategories(), await gatherFeaturedGames());
  const sortedGames = sortByDiscount(games);
  const topGames = sortedGames.slice(0, 10).map((g) => {
    g.store_url = `https://store.steampowered.com/app/${g.id}`;
    return g;
  });
  return topGames;
}

async function gatherFeaturedGames() {
  let res;
  try {
    res = await (await fetch(FEATURED_GAMES)).json();
  } catch (err) {
    console.error(err);
    return;
  }

  const games = res.featured_win;
  return games;
}

async function gatherFeaturedCategories() {
  let res;
  try {
    res = await (await fetch(FEATURED_CATEGORIES)).json();
  } catch (err) {
    console.error(err);
    return;
  }

  const games = res.specials.items.concat(
    res.top_sellers.items,
    res.new_releases.items);
  return games;
}

function sortByDiscount(games) {
  const arr = Array.from(games);
  for (let i = arr.length - 2; i > 0; i--) {
    for (let j = arr.length - 1; j > 0; j--) {
      const gameA = arr[j];
      const gameB = arr[j - 1];
      if (gameA.discount_percent <= gameB.discount_percent) {
        continue;
      }
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
    }
  }

  return arr;
}
