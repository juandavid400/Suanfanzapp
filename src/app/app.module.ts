import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';

//firebase
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import { environment } from '../environments/environment';
import { AngularFirestoreModule, AngularFirestore }    from 'angularfire2/firestore';
import { AngularFireStorageModule, AngularFireStorage }    from 'angularfire2/storage';
// import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuthModule } from '@angular/fire/auth';


//Servicios
import { RegisterService} from '../app/shared/services/register.service';
import { from } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from './shared/services/auth.service';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
// import { FileUploadComponent } from './pages/file-upload/file-upload.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    // FileUploadComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    NgxIntlTelInputModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    })
  ],
  providers: [
    RegisterService,
    AuthService,
    AngularFirestore,
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
