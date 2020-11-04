import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { MessageI } from '../../interfaces/MessageI';
import { HomeComponent } from 'src/app/pages/private/home/home.component';
import { v4 as uuidv4 } from 'uuid';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {
  scroll: any;

  @Input() title: string = ""
  @Input() status: string = ""
  @Input() icon: string = ""
  @Input() msgs: Array<MessageI> = []

  msg: string;
  socket = io.connect('http://localhost:3000');

  constructor(public chatService: ChatService, public homeComponent: HomeComponent) { }

  ngOnInit(): void {
    this.socket.on('broadcast', (socket) => {
      const status = document.getElementById('statusConection');
      status.innerHTML = socket
    })
    
    const boton_bajar = document.getElementById('bajar');
    boton_bajar.addEventListener("click", this.Down);
    console.log(scroll);
  }
  getTime(date){
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
  }
  sendMsg() {
    const msg: MessageI = {
      id:uuidv4(),
      content: this.msg,
      status: "",
      isMe: true,
      time: this.getTime(new Date(Date.now())),
      isRead: false,
      owner: this.title,
      from:""
    }
    this.homeComponent.myNewMessages(msg);
    this.chatService.sendMsg(msg);
    this.msg = "";

    this.scroll.scrollTo({
      top:5000,
      behavior:'smooth'
    })
  }

  Down(){    
    this.scroll = document.getElementById ('chat');
    this.scroll.scrollTo({
      top:1000,
      behavior:'smooth'
    })
  }

  areaBusquedachat() {
    const query: string = "#app .areaBusquedachat";
    const areaBusquedachat: any = document.querySelector(query);

    if (this.countbuschat == 0) {
      this.countbuschat = 1;
      areaBusquedachat.style.right = 0;
    } else {
      this.countbuschat = 0;
      areaBusquedachat.style.right = "-100vh"; 
    }
  }

  countbuschat: number = 0;


  areaEmoji() {
    const query: string = "#app .areaEmoji";
    const areaEmoji: any = document.querySelector(query);

    if (this.countemoji == 0) {
      this.countemoji = 1;
      areaEmoji.style.bottom = 0;      
      areaEmoji.style.opacity = 1;
      areaEmoji.style.transform = "scale(1)";
    } else {
      this.countemoji = 0;
      areaEmoji.style.bottom = "-100vh";     
      areaEmoji.style.opacity = 0;
      areaEmoji.style.transform = "scale(0)";
    }
  }

  countemoji: number = 0;
}