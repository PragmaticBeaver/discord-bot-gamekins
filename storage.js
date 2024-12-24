import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 43200, // TTL (time to live) for records
  checkperiod: 60, // check period for TTL expiration
  deleteOnExpire: true, // remove records after TTL is reached
});

export function saveData(key, value) {
  return cache.set(key, value);
}

export function loadData(key) {
  return cache.get(key);
}

export function stopCache() {
  cache.close();
}
