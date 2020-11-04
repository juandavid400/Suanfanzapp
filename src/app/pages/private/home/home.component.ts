import { Component, EventEmitter, OnDestroy, OnInit, Output, Directive,HostListener} from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/shared/services/auth.service";
import { ChatService } from "src/app/shared/services/chat/chat.service";
import { ChatI } from "./interfaces/ChatI";
import { Group } from "./interfaces/Group";
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
import { Key } from 'protractor';
import { error, info } from 'console';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  contactAdded: boolean = false;
  contactGroup: boolean = false;
  ListoImagen: boolean = false;
  AddToGroup: string;
  ImageSelected: string;
  registerList: UserI[];
  Currentimg: string;
  register = [];
  itemRef: any;
  Activechat: any;
  Addinfo: string;
  AreAllMembers: boolean = false;
  integrants: string[] = [];
  NameGroup: string;
  CurrentGroupimg: string;
  KeyGroup: any;
  copyKey: any;
  dBlock: string[] = [];

//---------------------------------------------------INIT DROP ZONE--------------------------------------------------------  
  fileUrl: string;
  ImgUrl:  string;
  ImgGUrl:  string;

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

  async getGroupImg(event){
    this.ImgGUrl = event;
    console.log("URL recibida en padre: " + this.ImgGUrl);
   await this.groupImage();
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

  async groupImage (){
    console.log("ENTRE MANASO");
    let Key;
    const Email = firebase.auth().currentUser.email;
    if(this.ImgGUrl){      
      await this.firebase.database.ref("registers").once("value", (users) => {
        users.forEach((user) => {
          const childKey = user.key;
          const childData = user.val();     
          if (childData.email == Email) {
            Key = childKey;
            user.forEach((info) => {
              info.forEach((group) =>{
                const groupChildKey = group.key;              
                if (groupChildKey == this.NameGroup){
                  console.log(groupChildKey);
                  info.forEach((Images) => {
                    Images.forEach((ImgUrl) => {
                      const ImagesChildKey = ImgUrl.key;
                      const ImagesChildData = ImgUrl.val();
                      const filter = /https:/gm;                    
                      if (ImagesChildKey == "ImgUrl"){
                        this.CurrentGroupimg = ImagesChildData;
                      }
                      console.log(ImagesChildKey);
                      console.log(ImagesChildData); 

                      let icon;
          
                        // if (childData.email == Email) {
                        //   // if (ImagesChildKey == this.NameGroup ){}
                        //     console.log("Entre en if");
                        //     console.log("valor de ImagesChildKey");
                        //     console.log(ImagesChildKey);
                        //     // if (ImagesChildKey != "chats" && ImagesChildKey == this.copyKey){}
                        //       const fb = this.firebase.database.ref("registers").child(childKey);
                        //       icon = this.ImgGUrl
                        //       let data = icon;
                        //       fb.child('chatRooms').child(this.NameGroup).child(ImagesChildKey).child("icon").set(data);
                            
                        // }
                    });
                  });
                }
              });
              
            });
          }
          
        });
      }); 
        // this.firebase.database.ref("registers").child(this.copyKey).child('chatRooms').child(this.NameGroup).push({
        //   icon: this.ImgGUrl
        // });
      this.toastr.success('Submit successful', 'Image updated');
    }
  
      const query: string = "#app .Groupimg";
      const Groupimg: any = document.querySelector(query);
      Groupimg.src = this.ImgGUrl;

        this.chats.push({
          owner: Email,
          integrants: this.integrants,
          title: this.NameGroup,
          icon: this.ImgGUrl,
          isRead: false,
          msgPreview: "Melosqui melosqui",
          lastMsg: "11:13",
          msgs: [
            {  content: Email + " has invite you to the group "+ this.NameGroup, isRead: true, isMe: true, time: "7:24" },
          ]
        });
        
                  
      this.integrants = [];
  }

//-----------------------------------------------------------------END DROP ZONE---------------------------------------  

  FormAdd = new FormGroup({
    Numbercontact: new FormControl(),
    Namecontact: new FormControl(),
  });

  FormNewGroup = new FormGroup({
    NameGroupContact: new FormControl(),
    NameGroup: new FormControl(),
  });

  subscriptionList: {
    connection: Subscription;
    msgs: Subscription;
  } = {
    connection: undefined,
    msgs: undefined,
  };
  groups: Array<Group> = [];

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

  

  async ngOnInit(){
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
     await this.PrintConsistance();
     await this.UpdatePerfilPhoto();
     await this.WhoIsWritingMe();
     await this.SearchImg();
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

  // onSelectInbox(index: number) {
  //   this.currentChat.title = this.chats[index].title;
  //   this.currentChat.icon = this.chats[index].icon;
  //   this.currentChat.msgs = this.chats[index].msgs;
  // }

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

  addcontact(count: number) {
    const query: string = "#app .addcontact";
    const addcontact: any = document.querySelector(query);

    if (count == 0) {
      count = 1;
      addcontact.style.left = 0;
    } else {
      count = 0;
      addcontact.style.left = "-100vh";
    }
  }

  areaEstados() {
    const query: string = "#app .areaEstados";
    const areaEstados: any = document.querySelector(query);

    if (this.countEstad == 0) {
      this.countEstad = 1;
      areaEstados.style.left = 0;
    } else {
      this.countEstad = 0;
      areaEstados.style.left = "-100vh";
    }
  }

  countEstad: number = 0;

  openaddContact(){
    if (this.count == 0){
      this.count = 1;
      this.addcontact(this.count);
    } else {      
      this.count = 0;
      this.addcontact(this.count);
    }
  }

  count: number = 1;

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

  createImageGroup() {
    const query: string = "#app .updateImageGroup";
    const updateImageGroup: any = document.querySelector(query);

    if (this.countImageGroup == 0) {
      this.countImageGroup = 1;
      updateImageGroup.style.left = 0;
    } else {
      this.countImageGroup = 0;
      updateImageGroup.style.left = "-100vh";
    }
  }

  countImageGroup: number = 0;
//-----------------------------------------------------Update perfil photo----------------------------------------------

  async UpdatePerfilPhoto(){

    let Key;
    const Email = firebase.auth().currentUser.email;
    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();     
        if (childData.email == Email) {
          Key = childKey;
          user.forEach((info) => {
            info.forEach((Images) => {
              Images.forEach((ImgUrl) => {
                const ImagesChildKey = ImgUrl.key;
                const ImagesChildData = ImgUrl.val();
                const filter = /https:/gm;

                if (ImagesChildKey == "ImgUrl"){
                  this.Currentimg = ImagesChildData;
                } 
              });
            });
          });
        }
      });
    });

    if(!this.Currentimg) {
      this.Currentimg = "../../../../assets/img/Noimage.jpg";
      const query: string = "#app .Photoimg";
      const Photoimg: any = document.querySelector(query);
      const query2: string = "#app .profile";
      const profile: any = document.querySelector(query2);
      const query3: string = "#app .profile2";
      const profile2: any = document.querySelector(query3);
      Photoimg.src = this.Currentimg;
      profile.src = this.Currentimg;
      profile2.src = this.Currentimg;
      console.log(profile.src);
    } else {
      const query: string = "#app .Photoimg";
      const Photoimg: any = document.querySelector(query);
      const query2: string = "#app .profile";
      const profile: any = document.querySelector(query2);
      const query3: string = "#app .profile2";
      const profile2: any = document.querySelector(query3);
      Photoimg.src = this.Currentimg;
      profile.src = this.Currentimg;
      profile2.src = this.Currentimg;
      console.log(this.Currentimg);      
    }
    
  }
  //-----------------------------------------------------End Update perfil photo----------------------------------------------
  async UpdateGroupPhoto(){
    console.log("Entre en UpdateGroupPhoto");
    let Key;
    const Email = firebase.auth().currentUser.email;
    console.log(Email);
    await this.firebase.database.ref("registers").once("value", (users) => {
      console.log("Entre en recorrido");
      users.forEach((user) => {
        console.log("Entre en users");        
        const childKey = user.key;
        const childData = user.val();
        console.log(childKey);     
        if (childData.email == Email) {
          console.log("Entre en if");
          Key = childKey;
          console.log(Key);
          user.forEach((info) => {
            console.log("Infokey");
            const infochildKey = user.key;
            if (infochildKey == this.NameGroup){
              info.forEach((images) =>{      
                  images.forEach((ImgUrl) => {
                    const ImagesChildKey = ImgUrl.val();
                    console.log("ImagesChildKey");
                    console.log(ImagesChildKey);
                    ImgUrl.forEach((ImgUrl) => {
                      const ImagesChildKey = ImgUrl.key;
                      const ImagesChildData = ImgUrl.val();
                      const filter = /https:/gm;                    
                      if (ImagesChildKey == "ImgUrl"){
                        console.log("Entre en if de urlimagen");
                        this.CurrentGroupimg = ImagesChildData;
                      } 
                      console.log("CurrentGroupimg");
                      console.log(this.CurrentGroupimg);
                      console.log("ImagesChildData");
                      console.log(ImagesChildData);
                      console.log(ImagesChildKey);
  
                    });
                  });
                
              });
            }
            
            
          });
        }
      });
    });

    if(!this.CurrentGroupimg) {
      this.CurrentGroupimg = "../../../../assets/img/pa.jpg";
      const query: string = "#app .Groupimg";
      const Groupimg: any = document.querySelector(query);
      Groupimg.src = this.CurrentGroupimg;
    } else {
      const query: string = "#app .Groupimg";
      const Groupimg: any = document.querySelector(query);
      Groupimg.src = this.CurrentGroupimg;   
    }
    
  }

  //-----------------------------------------------------Search IMg----------------------------------------------

  async SearchImg(){

    let Key;
    let ContactNumber = this.FormAdd.controls.Numbercontact.value;


    await this.firebase.database.ref("registers").once("value", (users) => {
      users.forEach((user) => {
        const childKey = user.key;
        const childData = user.val();
 // PRIMERA PASADA PARA RECORRER PRIMERA CAPA       
        if (childData.email == ContactNumber || childData.telefono.e164Number == ContactNumber) {
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

                if (ImagesChildKey == "ImgUrl"){
                  this.ImageSelected = ImagesChildData;
                }
                
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
    let Key;
    const ContactName = this.FormAdd.controls.Namecontact.value;
    let ContactNumber = this.FormAdd.controls.Numbercontact.value;
    const Email = firebase.auth().currentUser.email;
    let emailRegexp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);    
    this.ImageSelected = "../../../../assets/img/Noimage.jpg"; 

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
          // SEGUNDA PASADA PARA RECORRER DENTRO DEL USUARIO
          user.forEach((info) => {
            const infoChildKey = info.key;
            const infoChildData = info.val();
            // SEGUNDA PASADA PARA RECORRER DENTRO DE CONTACTS
            info.forEach((contact) => {
              const contactChildKey = contact.key;
              // TERCERA PASADA PARA RECORRER LOS NUMERO Y NOMBRE
              contact.forEach((Numbercontact) => {
                const numberContactChildKey = Numbercontact.key;
                const numberContactchildData = Numbercontact.val();
                if (numberContactchildData == ContactNumber) {
                  this.contactAdded = true;
                }
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

            // creamos su inbox-chat
          this.chats.push({
            email: ContactNumber,
            status: "",
            number: addNumber,
            title: ContactName,
            icon: this.ImageSelected,
            isRead: false,
            msgPreview: "",
            lastMsg: "11:13",
            msgs: [
              {  content: "Lorem ipsum dolor amet", isRead: true, isMe: true, time: "7:24" },
              {  content: "Qué?", isRead: true, isMe: false, time: "7:25" },
            ]
          });
          let chatsSize = this.chats.length - 1;
          this.firebase.database.ref('registers').child(Key).child('chatRooms').push({
            chats: this.chats[chatsSize],
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
              email: addEmail,
              status: "",
              number: ContactNumber,
              title: ContactName,
              icon: this.ImageSelected,
              isRead: false,
              msgPreview: "Melosqui melosqui",
              lastMsg: "11:13",
              msgs: [
                {  content: "Lorem ipsum dolor amet", isRead: true, isMe: true, time: "7:24" },
                {  content: "Qué?", isRead: true, isMe: false, time: "7:25" },
              ]
            });
            let chatsSize = this.chats.length - 1;
            this.firebase.database.ref('registers').child(Key).child('chatRooms').push({
              chats: this.chats[chatsSize],
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
  all(){
    this.AreAllMembers = true;
    this.SendGroup();
    this.createImageGroup()
    return this.AreAllMembers
  }

  //-----------------------------------------------------Group chat----------------------------------------------
  async SendGroup(){

    let NameGroupContact = this.FormNewGroup.controls.NameGroupContact.value;
    this.NameGroup = this.FormNewGroup.controls.NameGroup.value;
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
        if (childData.email == Email) {
          this.KeyGroup = childKey;
          user.forEach((info) => {
            info.forEach((contact) => {
              const contactChildKey = contact.key;
              contact.forEach((Numbercontact) => {
                const numberContactChildKey = Numbercontact.key;
                const numberContactchildData = Numbercontact.val();
                if (numberContactchildData == NameGroupContact) {
                  this.contactGroup = true;
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

    if (NameGroupContact.match(emailRegexp)) {
      // Es correo
      console.log("Es correo");
      userExist = this.registerList.find((user) => user.email == NameGroupContact);
      addNumber = userExist.telefono.e164Number;
      addName = userExist.name+ " " + userExist.lname;
      console.log("Es userexist");
      console.log(userExist);
      NameGroupContact = (userExist && userExist.email) || undefined;

      if (!userExist) {
        this.toastr.error("The user dont exist", "Check the email", {
          positionClass: "toast-top-center",
        });
      } else {
        if (this.contactGroup == true) {
          if (this.AreAllMembers == true){
            this.AreAllMembers = false;
            console.log("Entre en if de AreAllMembers");
            this.toastr.success(
              "The group " + this.NameGroup + " was created",
              "Added successfully",
              {
                positionClass: "toast-top-center",
              }
            );
            if (!NameGroupContact){
              console.log("ignore espacio vacio")
            } else {
              this.integrants.push(NameGroupContact);
            }
            this.copyKey = this.KeyGroup;
            this.firebase.database.ref('registers').child(this.copyKey).child('chatRooms').child(this.NameGroup).push({
              owner: Email,
              integrants: this.integrants,
              name: this.NameGroup,
              title: this.NameGroup,
              icon: "../../../../assets/img/Noimage.jpg",
              isRead: false,
              msgPreview: "Melosqui melosqui",
              lastMsg: "11:13",
              msgs: [
                {  content: Email + " has invite you to the group "+ this.NameGroup, isRead: true, isMe: true, time: "7:24" },
              ]
            })
            this.integrants=[];
            
          } else {
            console.log("Entre en else de AreAllMembers");
             this.integrants.push(NameGroupContact);
             console.log("integrants");
             console.log(this.integrants);
             this.toastr.success(
              "The user was " + addName + " added to the group",
              "Added successfully",
              {
                positionClass: "toast-top-center",
              }
            );
          }
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
        if (this.contactGroup == true) {
          if (this.AreAllMembers == true){
            this.AreAllMembers = false;
            console.log("Entre en if de AreAllMembers");
            this.toastr.success(
              "The group " + this.NameGroup + " was created",
              "Added successfully",
              {
                positionClass: "toast-top-center",
              }
            );
            if (!NameGroupContact){
              console.log("ignore espacio vacio")
            } else {
              this.integrants.push(NameGroupContact);
            }
            this.copyKey = this.KeyGroup;
            this.firebase.database.ref('registers').child(this.copyKey).child('chatRooms').child(this.NameGroup).push({
              owner: Email,
              integrants: this.integrants,
              name: this.NameGroup,
              title: this.NameGroup,
              icon: "../../../../assets/img/Noimage.jpg",
              isRead: false,
              msgPreview: "Melosqui melosqui",
              lastMsg: "11:13",
              msgs: [
                {  content: Email + " has invite you to the group "+ this.NameGroup, isRead: true, isMe: true, time: "7:24" },
              ]
            })
          this.integrants=[];
          } else {
            console.log("Entre en else de AreAllMembers");
             this.integrants.push(NameGroupContact);
             console.log("integrants");
             console.log(this.integrants);
             this.toastr.success(
              "The user was " + addName + " added to the group",
              "Added successfully",
              {
                positionClass: "toast-top-center",
              }
            );
          }
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
      NameGroup: this.NameGroup,
      NameGroupContact: ""
    });
  }

  async PrintConsistance(){ 
    let Key;
    const Email = firebase.auth().currentUser.email;

    await this.firebase.database.ref('registers').once('value', users => {
      users.forEach(user => {
        const childKey = user.key;
        const childData = user.val();
        if (childData.email == Email) {
          Key = childKey;
          user.forEach(info => {
            const infoChildKey = info.key;
            if (infoChildKey == 'chatRooms') {
              info.forEach(chatRooms => {
                chatRooms.forEach(chats => {
                  const chatContactChildKey = chats.key;
                  const chatContactChildData = chats.val();
                  this.chats.push(chatContactChildData);
                });
              });
            }
          });
        }
      });
    });
    this.initChat();   
  }

 
  WhoIsWritingMe(){
    console.log("Entre a la funcion renderizar");
    this.chatService.paraRenderizarMensaje().subscribe((msg: MessageI) => {
      console.log("Llego mensaje");
      console.log(msg.content);
      if(this.chats.length==0){
        console.log("primer IF")
        this.cargandoContactos(msg);
      }else{
        for (let i = 0; i < this.chats.length; i++) {
         
          console.log("entre al for y voy en el recorrido: "+i);  
          const newLocal = this.chats[i].email;
          console.log(this.chats);
          console.log(newLocal);  
        if (msg.from===newLocal) {
          console.log("Segundo IF y meto nuevo mensage")
          console.log("ya exite el contacto")
          this.chats[i].lastMsg=msg.time;
          this.chats[i].msgPreview=msg.content;
          msg.isMe = this.currentChat.title === msg.owner ? true : false;
          this.chats[i].msgs.push(msg);
          break;
          }else{
            this.countPop = 0;
            this.ConfirmPopUp(this.countPop);
            console.log("Entre al else")
            let f=i
            f++
            if (f==this.chats.length) {
            console.log("Entro al Elsey creo nuevo contacto")
            console.log("Nuevo contacto");
            this.cargandoContactos(msg);
            break
            }
            
            }
          }
            
    }});
  }

  async cargandoContactos(msg: MessageI) {

    msg.isMe = this.currentChat.title === msg.owner ? true : false;
    this.chats.push({
      email:msg.from,
      number: msg.from,
      title: msg.from,
      icon:"../../../../assets/img/Noimage.jpg",
      msgPreview:msg.content, 
      isRead:false, 
      lastMsg:msg.time, 
      msgs:[msg]})

      this.Addinfo = msg.from;

      // this.firebase.database.ref('registers').child('chatRooms').child("chats").child("msgs").push({
      //   email:msg.from,
      //   number: msg.from,
      //   title: msg.from,
      //   icon:"../../../../assets/img/Noimage.jpg",
      //   msgPreview:msg.time, 
      //   isRead:false, 
      //   lastMsg:msg.content, 
      //   msgs:[msg]
      // })  
  }
  
  async myNewMessages(msg: MessageI){
    //this.statusUserDesconnected()
    console.log("si imprimo mis mensajes")
    //this.esLeido(msg.from)
    msg.isMe=true;
    this.chatService.itsSelectd().subscribe((user:string) => {
      console.log("me Suscribi Aquien esta tocado")
    if (msg.from==user) {
      msg.isRead=true
    }
    });
    this.currentChat.msgs.push(msg);
  }

  async onSelectInbox(index: number) {
    // this.estadoActual="online";
    this.Activechat =this.chats[index].email;
   //this.statusUser();
    this.currentChat.title = this.chats[index].title;
      this.currentChat.icon = this.chats[index].icon;
      this.currentChat.msgs = this.chats[index].msgs;
      // this.currentChat.status=this.chats[index].status;
      console.log("he undido en"+this.currentChat.title)
      // console.log("estado"+this.currentChat.status)
    this.chatService.idenificadorId(this.Activechat);
    }

  SearchAnim() {}

  ConfirmPopUp(countPop: number) {
    const query: string = "#app .ConfirmPopUp";
    const ConfirmPopUp: any = document.querySelector(query);

    if (countPop == 0) {
      // this.countPop = 1;
      ConfirmPopUp.style.opacity = 1;
      ConfirmPopUp.style.transform = "scale(1)";
    } else {
      countPop = 0;
      ConfirmPopUp.style.opacity = 0;
      ConfirmPopUp.style.transform = "scale(0)";
    }
  }

  countPop: number = 0;

  async Add(){
    console.log("Entre en add");
    this.countPop = 1;
    this.count = 0;
    this.ConfirmPopUp(this.countPop);
    this.addcontact(this.count);
    console.log(this.count);
    console.log(this.countPop);
    let Email;
    
    // Email = this.FormAdd.controls.email.value();
    Email = this.Addinfo;
    console.log("Addinfo");
    console.log(this.Addinfo);
    this.chats.pop();
  }

  async Block(){
    console.log("Entre en add");
    this.countPop = 1;
    this.count = 0;
    this.ConfirmPopUp(this.countPop);

    this.chats.pop();
  }

  
}
