const io = require('socket.io');

let server;

/**
 * Inicializa el servidor.
 * @returns {Promise<any>}
 */
function init(){
  return new Promise((resolve, reject) => {
    try{
      server = io().listen(3001);
      resolve(server);
    }catch (e) {
      reject(new Error('Error init server Websocket'));
    }
  });
}

/**
 * Establece los listener de los sockets.
 * @param cbSendData
 * @returns {Promise<void>}
 */
async function start(cbSendData){
  try{
    const server = await init();
    if(typeof server !== 'Error'){
      server.on('connection', (socket) => {
        socket.emit('time', cbSendData());
        socket.on('requestTime', () => {
          socket.emit('time', cbSendData())
        });
      })
    }
  }catch (e) {
      throw e;
  }
}

/**
 * Cierra el servidor websocket.
 */
function close(){
  server.close();
}

module.exports = {
  init,
  start,
  close,
};
