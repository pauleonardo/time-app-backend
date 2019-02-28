const app = require('express')();

const http = require('http').Server(app);
const io = require('socket.io')(http);

http.listen(3001, '0.0.0.0', () => {
  console.warn('Servidor escuchando!');
})

let server;


/**
 * Inicializa el servidor.
 * @returns {Promise<any>}
 */
function init(){
  return new Promise((resolve, reject) => {
    try{
      server = io;
      resolve(server);
    }catch (e) {
      reject(new Error('Error init server Websocket', e.message));
    }
  }).catch((err) => console.warn(e));
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
      server.on('connection', async (socket) => {
        const data = await cbSendData();

        socket.emit('time', data );
        socket.on('requestTime', async () => {
            const data = await cbSendData();
            socket.emit('time', data );
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
