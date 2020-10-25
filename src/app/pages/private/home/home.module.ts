import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { InboxChatComponent } from './components/inbox-chat/inbox-chat.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { AddComponent } from './components/add/add.component';


@NgModule({
  declarations: [
    HomeComponent,
    InboxChatComponent,
    ChatAreaComponent,
    ChatMessageComponent,
    SearchComponent,
    AddComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
})
export class HomeModule { }
