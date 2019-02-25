const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const env = require('./config');

const port = process.env.PORT || env.PORT;

http.listen(port, function () {
  console.warn('Servidor Escuchando!', port);
});

io.on('connection', function (socket) {

  socket.emit('time', () => {

  });

  socket.on('timeRequest', () => {
    io.emit('time', '');
  });
});
