const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
//var ip = require("ip");
const port = 3000;

//const SocketIO = require('socket.io')(http);
//const encrypt = require('socket.io-encrypt');
//const io = SocketIO();

//io.use(encrypt(secret))
//--------------------------

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('newMsg', (msg) => {
    console.log(`Emitiendo nuevo mensaje: ${msg.content}`);
    io.emit('newMsg', msg);
  });
  socket.on('error', console.error )// handle decryption errors )
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

//-----------------------------