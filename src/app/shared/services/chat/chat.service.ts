import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { MessageI } from 'src/app/pages/private/home/interfaces/MessageI';
import { MessagePrivate } from 'src/app/pages/private/home/interfaces/MessagePrivate';
import { NewUsers } from 'src/app/pages/private/home/interfaces/NewUsers';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket: any;
  identificacion:any;
  identificadormio:any;
  email:any;
  contenido:any
  idenfiticacionMensaje:any;

  ListaUsuarios=[{}];
  constructor() { }
 
  connect() {
    console.log("me conecte perros")
    return new Observable(observer => {
      this.socket = io('http://localhost:3000');
      this.socket.on('connect', () => {
        this.identificadormio=this.socket.id;
        this.ListaUsuarios.push(this.email,this.identificadormio);
        console.log("Lista de Usuarios "+this.ListaUsuarios);
        //LISTAUSUARIOS.push(this.ListaUsuarios)
        observer.next();
        let enviar: NewUsers = {
          id:this.identificadormio,
          name:this.email
        }
        this.EnviarUsuario(enviar);
      })
    })
    
  }
  //identifica a quien le va a enviar el mensaje
  idenificadorId(identificador:string){
    /*return new Observable(observer => {
      this.socket.on("who", msg => {
        observer.next(msg);
      });
    });*/
    this.identificacion=identificador
    console.log("Identificaden la Funcion Identificador:" +identificador);
    console.log("Lista en La funcion identificador: "+this.ListaUsuarios);
  }
  //le envia al servidor quien acaba de conectarse
  EnviarUsuario(recibido:NewUsers){
    let usuerio: NewUsers = {
      id:recibido.id,
      name:recibido.name
    }
    this.socket.emit('UserConnected',usuerio);
  }
  //nos dice quien inicio sesion
  IdUsuario(email:string){
    console.log()
    this.email=email;
    console.log("Ha iniciado sesion " +email);
    //({user:this.createUser({name:email, socketId:this.identificadormio})})
    //this.ListaUsuarios.push(email,this.identificadormio);
  }

  getNewMsgs() {
    return new Observable(observer => {
      this.socket.on("newPerson", Userio => {
        observer.next(Userio);
      });
    });
  }

  //recibe el mensaje que se va a enviar
  sendMsg(msg: MessageI) {
    this.contenido=msg.content;
    this.idenfiticacionMensaje=msg.id;
    msg.from=this.email;
    this.envioMensaje(msg)
    //this.socket.emit('newMsg', msg);
  }
  paraRenderizarMensaje(){
    console.log("Estoy dentro renderizar")
    return new Observable(observer => {
      this.socket.on('Send', mensaje => {
        console.log("para que se suscriban")
        observer.next(mensaje);
      });
    });
    /*let observable = new Observable(observer=>{
      this.socket.on('Send', (data)=>{
        console.log("Llega el mensaje para enviar")
        observer.next(data);
      });
      //return () => {this.socket.disconnect();}
  });
  return observable;*/
  }
  //recibe todos los datos necesarios para enviar el mensaje
  envioMensaje(mensaje:MessageI){
    let sms: MessagePrivate = {
      id:this.idenfiticacionMensaje,
      to:this.identificadormio,
      from:this.identificadormio
    }
    //mensaje.isMe=false;
    sms.id=mensaje.id;
    sms.to=this.identificacion;
    sms.from=this.identificadormio;
    console.log(sms.id);
    console.log(sms.to);
    console.log(sms.from);
    // console.log(sms);
    this.socket.emit('WhatMessage',sms,mensaje);
  }
  //desconecta al usuario del servidor
  disconnect() {
    this.socket.disconnect();
    console.log("Se ha desconectado el usuario"+this.identificadormio)
  }

}