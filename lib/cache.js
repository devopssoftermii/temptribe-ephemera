var NodeCache = require('node-cache');
const ServerError = require('./errors/ServerError');

const defaultOptions = {
  useClones: false,
  stdTTL: 60
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
          resolve(value);
        } else {
          reject(new ServerError('cache_set_fail', {message: `Failed to set ${key} in cache: ${err.message}`}));
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
          reject(new ServerError('cache_get_fail', {message: `Failed to get ${key} in cache: ${err.message}`}));
        }
      });
    })
  };
  cache.pdel = function(key) {
    return new Promise(function(resolve, reject) {
      cache.del(key, function(err, count) {
        if (!err) {
          resolve(count);
        } else {
          reject(new ServerError('cache_del_fail', {message: `Failed to delete ${key} from cache: ${err.message}`}));
        }
      });
    })
  };
  cache.getOrSet = function(key, func) {
    return cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      return func().then(function(result) {
        return cache.pset(key, result);
      });
    })
  };
  return cache;
}
