const darkskyController = require('./src/DarkskyController/index');
const websocketController = require('./src/WebsocketController/index');
const redisController = require('./src/RedisController');

async function init() {
  darkskyController.init();
  redisController.init();
  let cities = await darkskyController.getTimeCities();

  async function updateTask() {
    return new Promise(async (resolve) => {
      const updated = await Promise.all(cities.map(async (city) => {
        const result = await redisController.pushTime(city);
        return result;
      }));
      resolve(updated);
    });
  }

  async function sendTask(){
      const result = await Promise.all(cities.map((city) => redisController.getTime(city.name)));
      return result;
  }

  function cbSocketP(){
    return new Promise(async (resolve, reject) => {
      await updateTask();
      try{
        if(Math.random() <= 0.1){
          throw new Error('How unfortunate! The API Request Failed');
        }
        const result = await sendTask();
        resolve(result);
      }catch (e) {
        redisController.setErrorRequest(e.message);
        reject(new Error(e));
      }
    }).catch((err) => console.warn(err.message));
  }

  console.warn('Servidor Escuchando');
  websocketController.start(cbSocketP);
}

init();
