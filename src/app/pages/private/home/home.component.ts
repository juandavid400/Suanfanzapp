import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { ChatI } from './interfaces/ChatI';
import { MessageI } from './interfaces/MessageI';
import { RegisterService } from "src/app/shared/services/register.service";
import { UserI } from 'src/app/shared/interfaces/UserI';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptionList: {
    connection: Subscription,
    msgs: Subscription
  } = {
      connection: undefined,
      msgs: undefined
  };

  chats: Array<ChatI> = [
    {
      title: "El costeño",
      icon: "/assets/img/ca.jpeg",
      isRead: true,
      msgPreview: "como gallinazo",
      lastMsg: "11:13",
      msgs: [
        {content: "a lo que se mueva", isRead:true, isMe:true, time:"7:24"},
        {content: "entonces ando de gallinazo", isRead:true, isMe:false, time:"7:25"},
      ]
    },
    {
      title: "El traumado",
      icon: "/assets/img/tr.jpg",
      isRead: true,
      msgPreview: "Suerte es que le deseo, haga eso pi****",
      lastMsg: "18:30",
      msgs: [
        {content: "Suerte es que le deseo, haga eso pi****", isRead:true, isMe:true, time:"9:24"},
        {content: "obligueme perro", isRead:true, isMe:false, time:"9:25"},
      ]

    },
    {
      title: "Solos Pobres y FEOS",
      icon: "/assets/img/td.jpeg",
      isRead: true,
      msgPreview: "Nice front 😎",
      lastMsg: "23:30",
      msgs: []
    },
    {
      title: "El de la moto",
      icon: "/assets/img/go.jpg",
      isRead: true,
      msgPreview: " 😎",
      lastMsg: "3:30",
      msgs: []
    },
    {
      title: "El charlon",
      icon: "/assets/img/al.PNG",
      isRead: true,
      msgPreview: " 😎",
      lastMsg: "8:30",
      msgs: []
    },
  ];

  currentChat = {
    title: "",
    icon: "",
    msgs: []
  };

  constructor(public authService: AuthService, public chatService: ChatService, private firebaseAuth:AngularFireAuth, 
    private registerService: RegisterService) {}

    ngOnInit(): void {
      this.initChat();
      this.UserAcount();
      this.registerService.getRegister();
      // .snapshotChanges().subscribe(item => {
      //   let data = item.payload.val();
  
      //   this.RegisterList = [];
  
      //   for (let k in data) {
      //     let element = data [k];
      //     element.key = k;
      //     this.RegisterList.push(element);       
      //   }
      //   console.log("sdadasd");
      //   console.log(this.RegisterList);
      // });
    }

    UserAcount (){
      // var user = this.firebaseAuth.auth.currentUser;
  
      this.firebaseAuth.auth.onAuthStateChanged(function(user) {
        if (user) {
  
          // User is signed in.
          var name, email, photoUrl, uid, emailVerified;
          if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;
            console.log("Nombre Usuario");
            console.log(name);
            console.log("Nombre email");
            console.log(email);
            console.log("Nombre foto");
            console.log(photoUrl);
            console.log("Nombre emailverificado");
            console.log(emailVerified);
            console.log("Nombre uid");
            console.log(uid);
          }
  
          if (user != null) {
            user.providerData.forEach(function (profile) {
              console.log("Sign-in provider: " + profile.providerId);
              console.log("  Provider-specific UID: " + profile.uid);
              console.log("  Name: " + profile.displayName);
              console.log("  Email: " + profile.email);
              console.log("  Phone Number: " + profile.photoURL);
            });
          }
          console.log(user);
        } else {
          // No user is signed in.
        }
      });
    }

  ngOnDestroy(): void {
    this.destroySubscriptionList();
    this.chatService.disconnect();
  }

  initChat() {
    if (this.chats.length > 0) {
      this.currentChat.title = this.chats[0].title;
      this.currentChat.icon = this.chats[0].icon;
      this.currentChat.msgs = this.chats[0].msgs;
    }
    this.subscriptionList.connection = this.chatService.connect().subscribe(_ => {
      console.log("Nos conectamos");
      this.subscriptionList.msgs = this.chatService.getNewMsgs().subscribe((msg: MessageI) => {
        msg.isMe = this.currentChat.title === msg.owner ? true : false;
        this.currentChat.msgs.push(msg);
      });
    });
  }

  onSelectInbox(index: number) {
    this.currentChat.title = this.chats[index].title;
      this.currentChat.icon = this.chats[index].icon;
      this.currentChat.msgs = this.chats[index].msgs;
  }

  doLogout() {
    this.authService.logout();
  }

  destroySubscriptionList(exceptList: string[] = []): void {
    for (const key of Object.keys(this.subscriptionList)) {
      if (this.subscriptionList[key] && exceptList.indexOf(key) === -1) {
        this.subscriptionList[key].unsubscribe();
      }
    }
  }

  SearchAnim(){

  }
  
  RegisterList: UserI[];
    register= [];
    itemRef: any;
  

}
