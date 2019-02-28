// const moment = require('moment');
const moment = require("moment-timezone");
const env = require("../../config");

const redis =
  process.env.NODE_ENV === "testing" ? require("redis-mock") : require("redis");

let clientRedis;

/**
 * Inicializa el cliente Redis
 * @returns {Promise<any>}
 */
function init() {
  const REDISPORT = env.REDISPORT;
  const REDISHOST = env.REDISHOST;
  return new Promise((resolve, reject) => {
    clientRedis = redis.createClient({
      host: REDISHOST,
      port: REDISPORT
    });
    clientRedis.on("connect", function() {
      resolve("OK");
    });
    clientRedis.on("error", function(err) {
      reject(new Error(err.message));
    });
  }).catch(err => console.warn(err));
}

/**
 * Verifica si el cliente Redis está conectado
 * @returns {Boolean}
 */
function isClientConnected() {
  return clientRedis ? clientRedis.connected : false;
}

/**
 * Guarda un tiempo de una ciudad en redis.
 * @param element
 * @returns {Promise<any | never>}
 */
function pushTime(element) {
  if (!element) throw new TypeError("Error undefined");
  if (
    !element.hasOwnProperty("name") ||
    !element.hasOwnProperty("latitude") ||
    !element.hasOwnProperty("timezone") ||
    !element.hasOwnProperty("temperature") ||
    !element.hasOwnProperty("time") ||
    !element.hasOwnProperty("longitude")
  ) {
    throw new TypeError("Error properties");
  }
  return new Promise(async (resolve, reject) => {
    try {
      clientRedis.hmset(
        element.name,
        "latitude",
        element.latitude,
        "longitude",
        element.longitude,
        "time",
        element.time,
        "name",
        element.name,
        "timezone",
        element.timezone,
        "temperature",
        element.temperature,
        function(err, result) {
          if (err) reject(err);
          resolve(result);
        }
      );
    } catch (e) {
      reject(
        new Error({
          name: element.name,
          status: "ERROR",
          error: e.message
        })
      );
    }
  }).catch(error => {
    console.warn(error.message);
    return error;
  });
}

/**
 * Obtiene desde Redis, el tiempo de una ciudad en especifico.
 * @param cityName
 * @returns {Promise<any>}
 */
function getTime(cityName) {
  if (!cityName || !cityName.length > 0) {
    throw new Error("need a city name");
  }
  return new Promise((resolve, reject) => {
    clientRedis.HGETALL(cityName, function(err, result) {
      if (err) reject(err);
      if (result === null) reject(new Error("ELEMENT IS NULL"));
      resolve(result);
    });
  });
}

/**
 * Guarda el único error permitido.
 * @param error
 * @returns {Promise<any>}
 */
function setErrorRequest(error) {
  const timestamp = moment().unix();
  return new Promise((resolve, reject) => {
    if (
      !error ||
      !error.length > 0 ||
      error !== "How unfortunate! The API Request Failed"
    ) {
      throw new Error("NO ES UN ERROR PERMITIDO");
    }
    clientRedis.hset("api.errors", timestamp, error, function(err, result) {
      if (err) reject(err);
      if (result === null) reject(new Error("RESULTADO ES NULL"));
      resolve("OK");
    });
  }).catch(error => {
    console.warn(error.message);
    return error;
  });
}

module.exports = {
  init,
  isClientConnected,
  pushTime,
  getTime,
  setErrorRequest
};
