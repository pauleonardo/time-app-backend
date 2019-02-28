let axios = require('axios');
let moment = require('moment');
const env = require('../../config');

let instanceAxios, apiKey, toRequest;

/**
 * Inicializa cliente axios, obtiene apikey y ciudades a las cuales obtener
 * mediante variables de entorno.
 */
function init(){
    apiKey = process.env.APIKEY || env.APIKEY;
    toRequest = process.env.CITIES || env.CITIES;
    instanceAxios = axios.create({
      baseURL: `https://api.darksky.net/forecast/${apiKey}`,
      timeout: 5000,
    });
}

/**
 * Verifica si esta definida la apikey.
 * @returns {boolean}
 */
function isDefinedApiKey() {
  return typeof apiKey !== 'undefined';
}

/**
 * Obtiene el tiempo de una ciudad
 * @param city - debe ser un objeto con las propiedades: latitude longitude name
 * @returns {Promise<any>}
 */
function getDataCity(city) {
  if(!city) throw new TypeError('Error undefined');
  if(!city.hasOwnProperty('name') || !city.hasOwnProperty('latitude')
    || !city.hasOwnProperty('longitude')){
    throw new TypeError ('Error properties');
  };
  return new Promise(async (resolve, reject) => {
    try {
      const result =
        await instanceAxios.get(`/${city.latitude},${city.longitude}`);
      const { latitude, longitude, timezone,
        currently: { time, temperature  } } = result.data;
      resolve({
        latitude, longitude, time, name: city.name, timezone, temperature
      });
    } catch (e) {
      const errorObject = {
        message: e.message,
      };
      reject(errorObject);
    }
  })
}

/**
 * Obtiene todas la data de las ciudades.
 * @returns {Promise<*>}
 */
function getTimeCities() {
  return new Promise(async (resolve, reject) => {
    try{
      if(!isDefinedApiKey()) throw new Error('ApiKey is not defined');
      const cities = await Promise.all(toRequest.map(async (city) => await getDataCity(city)));
      resolve(cities)
    } catch (e) {
      reject(e);
    }
  }).catch((error) => console.warn('Error "getTimeCities": ', error.message));
}

  module.exports = {
    init,
    getTimeCities,
    isDefinedApiKey,
    getDataCity,
  };
