import { Component, EventEmitter, OnDestroy, OnInit, Output, Directive,HostListener} from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/shared/services/auth.service";
import { ChatService } from "src/app/shared/services/chat/chat.service";
import { ChatI } from "./interfaces/ChatI";
import { MessageI } from "./interfaces/MessageI";
import { RegisterService } from "src/app/shared/services/register.service";
import { UserI } from "src/app/shared/interfaces/UserI";
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuth } from "@angular/fire/auth";
import {  FormControl,FormGroup,NgForm,Validators,FormBuilder,} from "@angular/forms";
import * as firebase from "firebase";
import { Router } from "@angular/router";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { ToastrService } from "ngx-toastr";
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  contactAdded: boolean = false;
  AddToGroup: boolean = false;
  ImageSelected: string;
  registerList: UserI[];
  register = [];
  itemRef: any;

//---------------------------------------------------INIT DROP ZONE--------------------------------------------------------  
  fileUrl: string;
  ImgUrl:  string;

  getUrl(event){
    this.fileUrl = event;
    console.log("URL recibida en padre: " + this.fileUrl);
  }
  async getImg(event){
    this.ImgUrl = event;
    console.log("URL recibida en padre: " + this.ImgUrl);
   await this.SendImage();
   await this.UpdatePerfilPhoto();
  }

  async SendImage (){
    console.log("ENTRE MANASO");

    if(this.ImgUrl){
      let Key;
      const Email = firebase.auth().currentUser.email;
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          const childKey = user.key;
          const childData = user.val();
          if (childData.email == Email) {
            Key = childKey;
            console.log("entramos", childKey);
            console.log("recorrido", childKey);
          }
                   
        });
      });
      this.firebase.database.ref("registers").child(Key).child("Images").push({
        ImgUrl: this.ImgUrl
      });
      
      this.toastr.success('Submit successful', 'Image updated');
    }
  }

//-----------------------------------------------------------------END DROP ZONE---------------------------------------  

  FormAdd = new FormGroup({
    Numbercontact: new FormControl(),
    Namecontact: new FormControl(),
  });

  FormNewGroup = new FormGroup({
    NameGroupContact: new FormControl()
  });

  subscriptionList: {
    connection: Subscription;
    msgs: Subscription;
  } = {
    connection: undefined,
    msgs: undefined,
  };

  chats: Array<ChatI> = [
    // {
    //   title: "El costeño",
    //   icon: "/assets/img/ca.jpeg",
    //   isRead: true,
    //   msgPreview: "como gallinazo",
    //   lastMsg: "11:13",
    //   msgs: [
    //     {
    //       content: "a lo que se mueva",
    //       isRead: true,
    //       isMe: true,
    //       time: "7:24",
    //     },
    //     {
    //       content: "entonces ando de gallinazo",
    //       isRead: true,
    //       isMe: false,
    //       time: "7:25",
    //     },
    //   ],
    // },
    // {
    //   title: "El traumado",
    //   icon: "/assets/img/tr.jpg",
    //   isRead: true,
    //   msgPreview: "Suerte es que le deseo, haga eso pi**",
    //   lastMsg: "18:30",
    //   msgs: [
    //     {
    //       content: "Suerte es que le deseo, haga eso pi**",
    //       isRead: true,
    //       isMe: true,
    //       time: "9:24",
    //     },
    //     { content: "obligueme perro", isRead: true, isMe: false, time: "9:25" },
    //   ],
    // },
    // {
    //   title: "Solos Pobres y FEOS",
    //   icon: "/assets/img/td.jpeg",
    //   isRead: true,
    //   msgPreview: "Nice front 😎",
    //   lastMsg: "23:30",
    //   msgs: [],
    // },
    // {
    //   title: "El de la moto",
    //   icon: "/assets/img/go.jpg",
    //   isRead: true,
    //   msgPreview: " 😎",
    //   lastMsg: "3:30",
    //   msgs: [],
    // },
    // {
    //   title: "El charlon",
    //   icon: "/assets/img/al.PNG",
    //   isRead: true,
    //   msgPreview: " 😎",
    //   lastMsg: "8:30",
    //   msgs: [],
    // },
  ];

  currentChat = {
    title: "",
    icon: "",
    msgs: [],
  };

  constructor(
    public authService: AuthService,
    public chatService: ChatService,
    private firebaseAuth: AngularFireAuth,
    private registerService: RegisterService,
    private router: Router,
    private firebase: AngularFireDatabase,
    private toastr: ToastrService
  ) {}

  

  ngOnInit(): void {
    this.initChat();
    this.UserAcount();
    this.registerService
      .getRegister()
      .snapshotChanges()
      .subscribe((item) => {
        this.registerList = [];
        item.forEach((element) => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.registerList.push(x as UserI);
        });
      });
  }

  UserAcount() {
    // var user = this.firebaseAuth.auth.currentUser;

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.

        if (user != null) {
          user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            // console.log("  Provider-specific UID: " + profile.uid);
            // console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            // console.log("  Phone Number: " + profile.photoURL);
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
    this.subscriptionList.connection = this.chatService
      .connect()
      .subscribe((_) => {
        console.log("Nos conectamos");
        this.subscriptionList.msgs = this.chatService
          .getNewMsgs()
          .subscribe((msg: MessageI) => {
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

  async doLogout() {
    await this.authService.logout();
    this.router.navigate(["/"]);
  }

  destroySubscriptionList(exceptList: string[] = []): void {
    for (const key of Object.keys(this.subscriptionList)) {
      if (this.subscriptionList[key] && exceptList.indexOf(key) === -1) {
        this.subscriptionList[key].unsubscribe();
      }
    }
  }

  addcontact() {
    const query: string = "#app .addcontact";
    const addcontact: any = document.querySelector(query);

    if (this.count == 0) {
      this.count = 1;
      addcontact.style.left = 0;
    } else {
      this.count = 0;
      addcontact.style.left = "-100vh";
    }
  }

  count: number = 0;

  PerfilPhoto() {
    const query: string = "#app .PerfilPhoto";
    const PerfilPhoto: any = document.querySelector(query);

    if (this.countPhoto == 0) {
      this.countPhoto = 1;
      PerfilPhoto.style.left = 0;
    } else {
      this.countPhoto = 0;
      PerfilPhoto.style.left = "-100vh";
    }
  }

  countPhoto: number = 0;

  SettingsToggle() {
    const query: string = "#app .DesplegableLeftMore";
    const DesplegableLeftMore: any = document.querySelector(query);

    if (this.countSett == 0) {
      this.countSett = 1;
      DesplegableLeftMore.style.opacity = 1;
      DesplegableLeftMore.style.transform = "scale(1)";
    } else {
      this.countSett = 0;
      DesplegableLeftMore.style.opacity = 0;
      DesplegableLeftMore.style.transform = "scale(0)";
    }
  }

  countSett: number = 0;

  createGroup() {
    const query: string = "#app .newGroupContainer";
    const newGroupContainer: any = document.querySelector(query);

    if (this.countGroup == 0) {
      this.countGroup = 1;
      newGroupContainer.style.left = 0;
    } else {
      this.countGroup = 0;
      newGroupContainer.style.left = "-100vh";
    }
  }

  countGroup: number = 0;
//-----------------------------------------------------Update perfil photo----------------------------------------------

  async UpdatePerfilPhoto(){

    let Key;
    let ContactNumber = this.FormAdd.controls.Numbercontact.value;
    const Email = firebase.auth().currentUser.email;


    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
 // PRIMERA PASADA PARA RECORRER PRIMERA CAPA       
        if (childData.email == Email) {
          Key = childKey;
          // SEGUNDA PASADA PARA RECORRER DENTRO DEL USUARIO
          user.forEach((info) => {
            const infoChildKey = info.key;
            const infoChildData = info.val();
            // SEGUNDA PASADA PARA RECORRER DENTRO DE CONTACTS
            info.forEach((Images) => {
              const imagesChildKey = Images.key;
              const imagesChilData = Images.val();
              // SEGUNDA PASADA PARA RECORRER LOS NUMERO Y NOMBRE
              Images.forEach((ImgUrl) => {
                const ImagesChildKey = ImgUrl.key;
                const ImagesChildData = ImgUrl.val();
                const filter = /https:/gm;

                if (ImagesChildData.match(filter)){
                  this.ImageSelected = ImagesChildData;
                }
              });
            });
          });
        }
      });
    });

    const query: string = "#app .Photoimg";
    const Photoimg: any = document.querySelector(query);
    const query2: string = "#app .profile";
    const profile: any = document.querySelector(query2);
    Photoimg.src = this.ImageSelected;
    profile.src = this.ImageSelected;
  }
  //-----------------------------------------------------End Update perfil photo----------------------------------------------
  //-----------------------------------------------------Search IMg----------------------------------------------

  async SearchImg(){

    let Key;
    let ContactNumber = this.FormAdd.controls.Numbercontact.value;


    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
 // PRIMERA PASADA PARA RECORRER PRIMERA CAPA       
        if (childData.email == ContactNumber) {
          Key = childKey;
          console.log("entramos", childKey);
          console.log("recorrido", childKey);
          // SEGUNDA PASADA PARA RECORRER DENTRO DEL USUARIO
          user.forEach((info) => {
            const infoChildKey = info.key;
            const infoChildData = info.val();
            console.log("info", infoChildKey);
            console.log("info", infoChildData);
            // SEGUNDA PASADA PARA RECORRER DENTRO DE CONTACTS
            info.forEach((Images) => {
              const imagesChildKey = Images.key;
              const imagesChilData = Images.val();
              console.log("Images", imagesChildKey);
              console.log("YIPETAAAAAAA", imagesChilData);
              // SEGUNDA PASADA PARA RECORRER LOS NUMERO Y NOMBRE
              Images.forEach((ImgUrl) => {
                const ImagesChildKey = ImgUrl.key;
                const ImagesChildData = ImgUrl.val();
                const filter = /https:/gm;

                if (ImagesChildData.match(filter)){
                  this.ImageSelected = ImagesChildData;
                }
                
                console.log("ImagesChildData");
                console.log(ImagesChildData);
                console.log("ImageSelectde");
                console.log(this.ImageSelected);
                

                console.log(
                  "ImgURL",
                  ImagesChildKey,
                  ImagesChildData
                );
              });
            });
          });
        }
      });
    });

    
    return this.ImageSelected;
  }
  //-----------------------------------------------------ENd Search IMg----------------------------------------------
  //-----------------------------------------------------Send Contact----------------------------------------------

  async SendContact() {
    console.log(this.registerList);
    let Key;
    const ContactName = this.FormAdd.controls.Namecontact.value;
    let ContactNumber = this.FormAdd.controls.Numbercontact.value;
    const Email = firebase.auth().currentUser.email;
    let emailRegexp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

    let userExist;
    let addNumber;
    let addEmail;  

    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
 // PRIMERA PASADA PARA RECORRER PRIMERA CAPA       
        if (childData.email == Email) {
          Key = childKey;
          console.log("entramos", childKey);
          console.log("recorrido", childKey);
          // SEGUNDA PASADA PARA RECORRER DENTRO DEL USUARIO
          user.forEach((info) => {
            const infoChildKey = info.key;
            const infoChildData = info.val();
            console.log("info", infoChildKey);
            // SEGUNDA PASADA PARA RECORRER DENTRO DE CONTACTS
            info.forEach((contact) => {
              const contactChildKey = contact.key;
              console.log("contact", contactChildKey);
              // TERCERA PASADA PARA RECORRER LOS NUMERO Y NOMBRE
              contact.forEach((Numbercontact) => {
                const numberContactChildKey = Numbercontact.key;
                const numberContactchildData = Numbercontact.val();
                if (numberContactchildData == ContactNumber) {
                  console.log("Ya lo tienes añadido");
                  this.contactAdded = true;
                }
                console.log(
                  "numberContact",
                  numberContactChildKey,
                  numberContactchildData
                );
              });
            });
          });
        }
      });
    });
    

    if (ContactNumber.match(emailRegexp)) {
      // Es correo
      console.log("Es correo");
      userExist = this.registerList.find((user) => user.email == ContactNumber);
      addNumber = userExist.telefono.e164Number;
        
      ContactNumber = (userExist && userExist.email) || undefined;

      if (!userExist) {
        this.toastr.error("The user dont exist", "Check the email", {
          positionClass: "toast-top-center",
        });
      } else {
        if (!this.contactAdded) {
          this.SearchImg();
          this.toastr.success(
            "The user " + ContactName + " was added",
            "Added successfully",
            {
              positionClass: "toast-top-center",
            }
          );
          this.firebase.database.ref("registers").child(Key).child("contacts").push({
              Namecontact: ContactName,
              Numbercontact: addNumber,
              contactEmail: ContactNumber,
            });


            this.chats.push({
              title: ContactName,
              icon: this.ImageSelected,
              isRead: false,
              msgPreview: "Melosqui melosqui",
              lastMsg: "11:13",
              msgs: [
                { content: "Lorem ipsum dolor amet", isRead: true, isMe: true, time: "7:24" },
                { content: "Qué?", isRead: true, isMe: false, time: "7:25" },
              ]
            });
        } else {
          this.toastr.error("The email already exist", "Check your contacts", {
            positionClass: "toast-top-center",
          });
        }
      }
    } else {
      console.log("Es teléfono");
      // Es teléfono
      userExist = this.registerList.find((user) => user.telefono.e164Number == ContactNumber && user);
      addEmail = userExist.email;
      if (!userExist) {
        this.toastr.error("The user dont exist ", "Error adding", {
          positionClass: "toast-top-center",
        });
      } else {
        if (!this.contactAdded) {
          this.SearchImg();
          console.log(ContactName, ContactNumber);
          this.toastr.success(
            "The phonenumber " + ContactNumber + " added",
            "Added successfully",
            {
              positionClass: "toast-top-center",
            }
          );
          this.firebase.database.ref("registers").child(Key).child("contacts").push({
              Namecontact: ContactName,
              Numbercontact: ContactNumber,
              contactEmail: addEmail,
            });

            this.chats.push({
              title: ContactName,
              icon: this.ImageSelected,
              isRead: false,
              msgPreview: "Melosqui melosqui",
              lastMsg: "11:13",
              msgs: [
                { content: "Lorem ipsum dolor amet", isRead: true, isMe: true, time: "7:24" },
                { content: "Qué?", isRead: true, isMe: false, time: "7:25" },
              ]
            });
        } else {
          this.toastr.error(
            "The phonenumber already exist",
            "Check your contacts",
            {
              positionClass: "toast-top-center",
            }
          );
        }
      }
    }

    this.FormAdd.reset({
      Namecontact: "",
      Numbercontact: "",
    });
  }
  //-----------------------------------------------------End Send Contact----------------------------------------------
  //-----------------------------------------------------Group chat----------------------------------------------
  async SendGroup(){
    let Key;
    let NameGroupContact = this.FormNewGroup.controls.NameGroupContact.value;
    const Email = firebase.auth().currentUser.email;
    let emailRegexp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

    let userExist;
    let addNumber;
    let addEmail;
    let addName;

    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
 // PRIMERA PASADA PARA RECORRER PRIMERA CAPA       
        if (childData.email == Email) {
          Key = childKey;
          console.log("entramos", childKey);
          console.log("recorrido", childKey);
          // SEGUNDA PASADA PARA RECORRER DENTRO DEL USUARIO
          user.forEach((info) => {
            const infoChildKey = info.key;
            console.log("info", infoChildKey);
            // SEGUNDA PASADA PARA RECORRER DENTRO DE CONTACTS
            info.forEach((contact) => {
              const contactChildKey = contact.key;
              console.log("contact", contactChildKey);
              // TERCERA PASADA PARA RECORRER LOS NUMERO Y NOMBRE
              contact.forEach((Numbercontact) => {
                const numberContactChildKey = Numbercontact.key;
                const numberContactchildData = Numbercontact.val();
                if (numberContactchildData == NameGroupContact) {
                  this.AddToGroup = true;
                }
                console.log(this.AddToGroup);
                console.log(
                  "numberContact",
                  numberContactChildKey,
                  numberContactchildData
                );
              });
            });
          });
        }
      });
    });

    if (NameGroupContact.match(emailRegexp)) {
      // Es correo
      console.log("Es correo");
      userExist = this.registerList.find((user) => user.email == NameGroupContact);
      addNumber = userExist.telefono.e164Number;
      addName = userExist.name+ " " + userExist.lname;
        
      NameGroupContact = (userExist && userExist.email) || undefined;

      if (!userExist) {
        this.toastr.error("The user dont exist", "Check the email", {
          positionClass: "toast-top-center",
        });
      } else {
        if (this.AddToGroup) {
          this.SearchImg();
          this.toastr.success(
            "The user was " + addName + " added to the group",
            "Added successfully",
            {
              positionClass: "toast-top-center",
            }
          );
          this.firebase.database.ref("registers").child(Key).child("group").push({
              Namecontact: addName,
              Numbercontact: addNumber,
              contactEmail: NameGroupContact,
            });

        } else {
          this.toastr.error("The email dont exist in your contacts", "Check your contacts", {
            positionClass: "toast-top-center",
          });
        }
      }
    } else {
      console.log("Es teléfono");
      // Es teléfono
      userExist = this.registerList.find((user) => user.telefono.e164Number == NameGroupContact && user);
      addEmail = userExist.email;
      addName = userExist.name+ " " + userExist.lname;

      if (!userExist) {
        this.toastr.error("The user dont exist", "Error adding", {
          positionClass: "toast-top-center",
        });
      } else {
        if (this.AddToGroup) {
          this.SearchImg();
          this.toastr.success(
            "The user was " + addName + " added to the group",
            "Added successfully",
            {
              positionClass: "toast-top-center",
            }
          );
          this.firebase.database.ref("registers").child(Key).child("group").push({
            Namecontact: addName,
            Numbercontact: NameGroupContact,
            contactEmail: addEmail,
          });

        } else {
          this.toastr.error(
            "The user dont exist",
            "Check your contacts",
            {
              positionClass: "toast-top-center",
            }
          );
        }
      }
    }

    this.FormNewGroup.reset({
      NameGroupContact: ""
    });
  }

  SearchAnim() {}
}
