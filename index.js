const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
<<<<<<< HEAD
//var ip = require("ip");
const port = 3000;

//const SocketIO = require('socket.io')(http);
//const encrypt = require('socket.io-encrypt');
//const io = SocketIO();

//io.use(encrypt(secret))
//--------------------------
=======

const port = 3000;
>>>>>>> a508ca2feb26c9cda321a62603e2f011f4c46f19

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('newMsg', (msg) => {
    console.log(`Emitiendo nuevo mensaje: ${msg.content}`);
    io.emit('newMsg', msg);
  });
<<<<<<< HEAD
  socket.on('error', console.error )// handle decryption errors )
=======

>>>>>>> a508ca2feb26c9cda321a62603e2f011f4c46f19
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
<<<<<<< HEAD

//-----------------------------
=======
>>>>>>> a508ca2feb26c9cda321a62603e2f011f4c46f19
