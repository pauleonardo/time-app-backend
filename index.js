const darkskyController = require('./src/DarkskyController/index');
const websocketController = require('./src/WebsocketController/index');
const redisController = require('./src/RedisController');

async function init() {
  darkskyController.init();
  redisController.init();
  let cities;
  async function updateTask() {
    return new Promise(async (resolve,  reject) => {
       cities = await darkskyController.getTimeCities();
       if(Array.isArray(cities)){
         const updated = await Promise.all(cities.map(async (city) => {
           const result = await redisController.pushTime(city);
           return result;
         }));
         resolve(updated);
       } else {
         reject(new Error('Error updateTask()'));
       }
    }).catch((error) => console.warn(error.message));
  }

  async function sendTask(){
    if(cities && cities.length > 1){
      const result = await Promise.all(cities.map((city) => redisController.getTime(city.name)));
      return result;
    }
  }

  function cbSocketP(){
    return new Promise(async (resolve, reject) => {
      try{
        await updateTask();
        if(Math.random() <= 0.1){
          throw new Error('How unfortunate! The API Request Failed');
        }
        const result = await sendTask();
        resolve(result);
      }catch (e) {
        redisController.setErrorRequest(e.message).catch(err => console.warn(err.message));
        reject(new Error(e));
      }
    }).catch((err) => console.warn(err.message));
  }

  console.warn('Iniciando Servidor...');
  websocketController.start(cbSocketP);
}

init();
