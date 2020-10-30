import { Component, OnInit } from "@angular/core";
import {  FormControl, FormGroup, NgForm, Validators, FormBuilder,} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { RegisterService } from "src/app/shared/services/register.service";
import { AngularFireDatabase} from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { CustomValidators } from 'src/app/custom-validators';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { UserI } from 'src/app/shared/interfaces/UserI';
import * as io from 'socket.io-client';
import * as firebase from 'firebase';



@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	phoneForm = new FormGroup({
		phone: new FormControl(undefined, [Validators.required])
	});

	changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  
  ngForm = new FormGroup({
    name: new FormControl(),
    lname: new FormControl(),
    telefono: new FormControl(),
    email: new FormControl(),    
    password: new FormControl(),
    confirmPassword: new FormControl(),      
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
    private firebaseDB: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
    private toastr: ToastrService
  ) {

    this.ngForm = this.createSignupForm();
  }

  createSignupForm(): FormGroup {
    return this.formBuilder.group(
      { 
        telefono: "",
        name: "",
        lname: "",
        email: [
          null,
          Validators.compose([Validators.email, Validators.required])
        ],
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            // CustomValidators.patternValidator(/\d/, {
            //   hasNumber: true
            // }),
            // // check whether the entered password has upper case letter
            // CustomValidators.patternValidator(/[A-Z]/, {
            //   hasCapitalCase: true
            // }),
            // // check whether the entered password has a lower case letter
            // CustomValidators.patternValidator(/[a-z]/, {
            //   hasSmallCase: true
            // }),
            // check whether the entered password has a special character
            // CustomValidators.patternValidator(
            //   /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            //   {
            //     hasSpecialCharacters: true
            //   }
            // ),
            Validators.minLength(6)
          ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

    registerList: UserI[];
    register= [];
    itemRef: any;

  ngOnInit(): void {
    this.registerService.getRegister()
    .snapshotChanges().subscribe(item => {
      this.registerList = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.registerList.push(x as UserI);
      });
    });    
  }
  
  createForm() {
    this.ngForm = this.formBuilder.group({
      email: "",
      telefono: "",
      name: "",
      lname: "",
      password: "",
      confirmPassword: "",
      socketId: "",
    });
  }

  onSubmit() {
    
    const Email = this.ngForm.controls.email.value;
    const telefono = this.ngForm.controls.telefono.value;
    const Password = this.ngForm.controls.password.value;
    const ConfirmPassword = this.ngForm.controls.confirmPassword.value;
    let EmailExist = this.registerList.find(user => user.email == Email);
    let PhoneExist = this.registerList.find(user => user.telefono.e164Number == telefono.e164Number);
    
    // let socket = io();
    //   let id : any; 
    //   //on connect Event 
    //   socket.on('connect', () => {
    //       //get the id from socket
    //       let id = socket.id;
    //       console.log(id);
    //      return id;
    //   });
  
    if (EmailExist) {
      console.log("Ya existe este email");
      this.toastr.error('The email is already taken', 'Try another email', {
        positionClass: 'toast-top-center'
      });
    } else if (PhoneExist) {
      this.toastr.error('The phonenumber is already taken', 'Try another number', {
        positionClass: 'toast-top-center'
      });
      console.log("Ya existe este número");
    } else {

      this.toastr.success('Account registered', 'Login to your account', {
        positionClass: 'toast-top-center'
      });
      
      this.registerService.insertRegister(this.ngForm.value);
      if (ConfirmPassword == Password) {
        firebase.auth().createUserWithEmailAndPassword(Email, Password).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
        });

    
      // this.resetForm();
      this.ngForm.reset({
        email : '',
        telefono: '',
        name: '',
        lname: '',
        password: '',
        confirmPassword: '',
      });

      this.router.navigate(["/login"]);

        }  
    
      }
    }


  goToLogin() {
    this.router.navigate(["/login"]);
  }
}
