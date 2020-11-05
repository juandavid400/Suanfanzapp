const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const userConnected = "online";

const port = 3000;
// const { isClassOrTypeElement } = require('typescript');
// const SocketManager = require('./src/server/SocketManager')
// const { createUser, createMessage, createChat } = require('./src/Factories');

let connectedUsers = { }


io.on('connection', (socket) => {
  io.sockets.emit('broadcast',userConnected);
  console.log("Socket Id:" + socket.id);
  console.log('a user connected');
  //console.log(socket.id);
  //console.log(email);
  socket.on('UserConnected', (user)=>{
		//user.socketId = socket.id
    connectedUsers = addUser(connectedUsers, user);
    // socket.id.io.emit('broadcast',userConnected);
		socket.user = user;
		//sendMessageToChatFromUser = sendMessageToChat(user.name)
		//sendTypingFromUser = sendTypingToChat(user.name)
		io.emit('UserConnected', connectedUsers);
		console.log(connectedUsers);

  });

  socket.on('esteSeleccionado', (identificador) =>{
    console.log("esta seleccionado"+identificador)
    usuario=isUser(connectedUsers,identificador)
      console.log("ConnectedUser[identificador] "+usuario)
      if (usuario===false) {
        console.log("usuario no conectado")
        io.emit('Desconectado',identificador)
      }else{
        const recieverSocket = connectedUsers[identificador].id
      io.to(recieverSocket).emit('EstaConectado',identificador)
    }
  })

  socket.on('Bloqueado',(from , mycorreo) =>{
    const Bloqueado = "Bloqueado" ;
    const recieverSocket = connectedUsers[from].id
    io.to(recieverSocket).emit('Enviado', Bloqueado , mycorreo)
    
  });

  //Funcion cuando alguien se desconecte
  socket.on('disconnect', ()=>{
    io.sockets.emit('broadcast',' ')
		if("user" in socket){
			connectedUsers = removeUser(connectedUsers, socket.user.name)

			io.emit('UserConnected', connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
  })

  //funcion cuando alguien cierre sesion
  /*socket.on(LOGOUT, ()=>{
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		io.emit(USER_DISCONNECTED, connectedUsers)
		console.log("Disconnect", connectedUsers);

  })*/
  
	/*socket.on(MESSAGE_SENT, ({chatId, message})=>{
		sendMessageToChatFromUser(chatId, message)
	})*/

  //funcion cuando alguien este escribiendo
	/*socket.on('Escribiendo', ({chatId, isTyping})=>{
		sendTypingFromUser(chatId, isTyping)
  })*/
  
 socket.on('newMsg', (msg) => {
    //console.log(`Imprimiendo usuarios ${ChatService.ListaUsuario}`);
    console.log(`Imprimiendo users from Socket Manager ${connectedUsers}`);
    console.log(`Emitiendo nuevo mensaje: ${msg.content}`);
    console.log(`Id de mensaje: ${msg.id}`);
    console.log(`Mensaje Para: ${msg.to}`);
    io.emit('newPerson', msg);
  });

  //recibe la info del mensaje privado
  socket.on('WhatMessage',(msg,mensaje)=>{
		//if(msg.to in connectedUsers){
      usuario=isUser(connectedUsers,msg.to)
      console.log("ConnectedUser[msg.to] "+usuario)
      if (usuario===undefined) {
        console.log("usuario no conectado")
        io.emit('Desconectado',msg.to)
      }else{
        const recieverSocket = connectedUsers[msg.to].id
      //const recieverName = connectedUsers[msg.from].name
      //io.to(recieverSocket).emit(mensaje)
      console.log("Se ha enviado mensahe a: "+recieverSocket+","+msg.to)
      console.log("Se ha enviado: "+mensaje.content)
      console.log("mensaje from: "+msg.from)
      //HomeComponent.WhoIsWritingMe(msg.from,mensaje)
      io.emit('Conectado',msg.to)
      io.to(recieverSocket).emit('Send',mensaje)
      }
      //
    //}
    //io.emit('otro',mensaje)
  })


});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

/*io.on('disconnect', (socket)=>{
  
    console.log("Se ha desconectado el usuario"+socket.id);
  })
  //cambios probados*/
  function addUser(userList, user){
    let newList = Object.assign({}, userList)
    newList[user.name] = user
    return newList
  }

  function removeUser(userList, username){
    let newList = Object.assign({}, userList)
    delete newList[username]
    return newList
  }

  function isUser(userList, username){
  	return username in userList
}