import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { MessageI } from '../../interfaces/MessageI';

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

  constructor(public chatService: ChatService) { }

  ngOnInit(): void {
  }

  sendMsg() {
    const msg: MessageI = {
      content: this.msg,
      isMe: true,
      time: "8:58",
      isRead: false,
      owner: this.title
    }
    this.chatService.sendMsg(msg);
    this.msg = "";
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
    } else {
      this.countemoji = 0;
      areaEmoji.style.bottom = "-100vh";
    }
  }

  countemoji: number = 0;




}
