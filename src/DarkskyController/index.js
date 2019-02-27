let axios = require('axios');
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
      const result = await instanceAxios.get(`/${city.latitude},${city.longitude}`);
      const { latitude, longitude, currently: { time } } = result.data;
      resolve({
        latitude, longitude, time, name: city.name,
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
async function getTimeCities() {
  try{
    if(!isDefinedApiKey()) throw new Error('ApiKey is not defined');
    const cities = await Promise.all(toRequest.map(async (city) => await getDataCity(city)));
    return cities;
  } catch (e) {
    return e.message;
  }
}

  module.exports = {
    init,
    getTimeCities,
    isDefinedApiKey,
    getDataCity,
  };
