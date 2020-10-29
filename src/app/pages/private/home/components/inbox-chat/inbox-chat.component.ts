import { Component, Input, OnInit } from '@angular/core';
import { UserI } from 'src/app/shared/interfaces/UserI';
import { RegisterService } from 'src/app/shared/services/register.service';

@Component({
  selector: 'app-inbox-chat',
  templateUrl: './inbox-chat.component.html',
  styleUrls: ['./inbox-chat.component.scss']
})
export class InboxChatComponent implements OnInit {

  @Input() profilePic: string
  @Input() name: string
  @Input() msgTime: string
  @Input() msgPreview: string
  @Input() isRead: string = undefined

  registerList: UserI[];
  register = [];
  itemRef: any;

  readStatusColor: string

  constructor(
    private registerService: RegisterService,) { 
    
  }

  ngOnInit(): void {

    this.readStatusColor = this.isRead && this.isRead !== "false" ? "#50C2F7" : "#ABABAB";
    
  }



}
