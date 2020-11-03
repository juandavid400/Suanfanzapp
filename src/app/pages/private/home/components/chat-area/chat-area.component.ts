import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { MessageI } from '../../interfaces/MessageI';
import { HomeComponent } from 'src/app/pages/private/home/home.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  @Input() title: string = ""
  @Input() icon: string = ""
  @Input() msgs: Array<MessageI> = []

  msg: string;

  constructor(public chatService: ChatService, public homeComponent: HomeComponent) { }

  ngOnInit(): void {
  }
  getTime(date){
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
  }
  sendMsg() {
    const msg: MessageI = {
      id:uuidv4(),
      content: this.msg,
      isMe: true,
      time: this.getTime(new Date(Date.now())),
      isRead: false,
      owner: this.title,
      from:""
    }
    this.homeComponent.myNewMessages(msg);
    this.chatService.sendMsg(msg);
    this.msg = "";
  }
}