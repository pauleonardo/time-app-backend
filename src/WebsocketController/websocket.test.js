const client = require('socket.io-client');
const chai = require('chai');

const websocketController = require('./index');

const expect = chai.expect;

describe('Websocket Controller', () => {
  let socketClient;
  beforeEach((done) => {

    socketClient = client.connect('http://localhost:3001',{
        'reconnection delay' : 0,
        'reopen delay' : 0,
        'force new connection' : true
    });
    socketClient.on('connect', () => {
        console.log('worked...');
      });
    socketClient.on('disconnect', () => {
        console.log('disconnected...');
      });
      done();
  });

  afterEach((done) => {
    if(socketClient.connected) {
      console.log('disconnecting...');
      socketClient.disconnect();
    } else {
      console.log('no connection to break...');
    }
    done();
  });

  it('Inicializa el servidor, esperar un cliente y desconectar', (done) => {

    websocketController.init().then((server) => {
      server.on('connect', () => {
        server.close(() => done());
      });
    });

  });

  it('Verificar que Listeners corresponden con la misma data', (done) => {

    const saludo = 'hola cliente';
    const cb = () => Promise.resolve(saludo);
    socketClient.on('time', (data) => {
      expect(data).to.equal(saludo);
      websocketController.close();
      done();
    });
    websocketController.start(cb);
  });

  it('En caso que el cliente solicite la hora, se le devuelva un dato', (done) => {
    let sum = 0;
    const cb = () => new Promise( (resolve) => {
      sum++;
      resolve(sum);
    });

    socketClient.on('time', (data) => {
      if(data === 2){
        websocketController.close();
        done();
      }
    });

    socketClient.emit('requestTime');
    websocketController.start(cb);

  });
});
