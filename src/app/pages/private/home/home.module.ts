import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { InboxChatComponent } from './components/inbox-chat/inbox-chat.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { DropZoneDirective } from 'src/app/shared/services/drop-zone.directive';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    HomeComponent,
    InboxChatComponent,
    ChatAreaComponent,
    ChatMessageComponent,
    FileUploadComponent,        
    DropZoneDirective,
  ],
  imports: [
    CommonModule,  FormsModule, AngularFireAuthModule, ReactiveFormsModule,ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    })
  ],
})
export class HomeModule { }
