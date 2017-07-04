var NodeCache = require('node-cache');

module.exports = function(ttl) {
  var cache = new NodeCache({
    stdTTL: ttl,
    useClones: false
  });
  cache.delete = cache.del.bind(cache);
  cache.clear = cache.flushAll.bind(cache);
  return cache;
}
