import { Injectable } from '@angular/core';
import { UserI } from '../interfaces/UserI';
import { Router } from  "@angular/router";
import { RegisterComponent } from 'src/app/pages/public/register/register.component';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: UserI | undefined;

  constructor() {  }

 


  isLogged() {
    // const Email = this.signupForm.controls.signupEmail.value;
    // const Password = this.signupForm.controls.signupPassword.value;
    const user = window.localStorage.getItem('user') || undefined;
    console.log(user);
    const isLogged = user ? true : false;
    if (isLogged) this.user = JSON.parse(user);
    return isLogged;
  }

  logout() {
    window.localStorage.clear();
    window.location.href = '';
  }
}
