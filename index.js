const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 3000;

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id);
  //console.log(email);
  socket.on('newMsg', (msg) => {
    console.log(`Emitiendo nuevo mensaje: ${msg.content}`);
    io.emit('newMsg', msg);
  });

});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

io.on('disconnect', (socket)=>{
  
    console.log("Se ha desconectado el usuario"+socket.id);
  })
  //cambios probados