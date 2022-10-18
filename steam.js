import fetch from "node-fetch";

const FEATURED_GAMES = "http://store.steampowered.com/api/featured/?l=english";
const FEATURED_CATEGORIES = "http://store.steampowered.com/api/featuredcategories/?l=english";

export async function gatherSteamDeals() {
  // id: 1659420,
  // type: 0,
  // name: 'UNCHARTED™: Legacy of Thieves Collection',
  // discounted: false,
  // discount_percent: 0,
  // original_price: 4999,
  // final_price: 4999,
  // currency: 'EUR',
  // large_capsule_image: 'https://cdn.akamai.steamstatic.com/steam/apps/1659420/capsule_616x353.jpg?t=1666040003',
  // small_capsule_image: 'https://cdn.akamai.steamstatic.com/steam/apps/1659420/capsule_184x69.jpg?t=1666040003',
  // windows_available: true,
  // mac_available: false,
  // linux_available: false,
  // streamingvideo_available: false,
  // header_image: 'https://cdn.akamai.steamstatic.com/steam/apps/1659420/header.jpg?t=1666040003',
  // controller_support: 'full'

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

// todo swap elements
function sortByDiscount(games) {
  const arr = Array.from(games);
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i; j++) {
      const gameA = arr[j];
      const gameB = arr[j + 1];
      if (gameA.discount_percent <= gameB.discount_percent) {
        continue;
      }
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
  return arr;
}
