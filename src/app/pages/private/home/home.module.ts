import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { InboxChatComponent } from './components/inbox-chat/inbox-chat.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    HomeComponent,
    InboxChatComponent,
    ChatAreaComponent,
    ChatMessageComponent,
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    })
  ],
})
export class HomeModule { }
