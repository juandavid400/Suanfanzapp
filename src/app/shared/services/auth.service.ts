import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { UserI } from '../interfaces/UserI';
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // user: UserI | undefined;

  constructor(private firebaseAuth: AngularFireAuth) { }


  async logout() {
    await firebase.auth().signOut();
  }
}