import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { UserI } from "../interfaces/UserI";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  RegisterList: AngularFireList<any>;
  // selectedProduct: UserI = new UserI();

  constructor(private firebase: AngularFireDatabase) { }

  getRegister(){
    return this.RegisterList = this.firebase.list('registers');
  }

  insertRegister(register: UserI){

    this.RegisterList.push({
      email: register.email,
      telefono: register.telefono,
      password: register.password,
      name: register.name,
      lname: register.lname,      
    });
  }
}
