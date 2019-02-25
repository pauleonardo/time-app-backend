let axios = require('axios');
const env = require('../../config');

let instanceAxios, apiKey, toRequest;

function init(){
    apiKey = process.env.APIKEY || env.APIKEY;
    toRequest = process.env.CITIES || env.CITIES;
    instanceAxios = axios.create({
      baseURL: `https://api.darksky.net/forecast/${apiKey}`,
      timeout: 5000,
    });
}

function isDefinedApiKey() {
  return typeof apiKey !== 'undefined';
}

function getDataCity(city) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instanceAxios.get(`/${city.latitude},${city.longitude}`);
      const { latitude, longitude, currently: { time } } = result.data;
      resolve({
        latitude, longitude, time
      });
    } catch (e) {
      const errorObject = {
        message: e.message,
      };
      reject(errorObject);
    }
  })
}

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
