var NodeCache = require('node-cache');

const defaultOptions = {
  useClones: true,
  stdTTL: 0
};

module.exports = function(options = defaultOptions) {
  options = Object.assign({}, defaultOptions, options);
  var cache = new NodeCache(options);
  cache.delete = cache.del.bind(cache);
  cache.clear = cache.flushAll.bind(cache);
  cache.pset = function(key, value) {
    return new Promise(function(resolve, reject) {
      cache.set(key, value, function(err, success) {
        if (!err && success) {
          resolve(key);
        } else {
          reject(key);
        }
      });
    })
  };
  cache.pget = function(key) {
    return new Promise(function(resolve, reject) {
      cache.get(key, function(err, value) {
        if (!err) {
          resolve(value);
        } else {
          reject(key);
        }
      });
    })
  };
  return cache;
}
