import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ModalController, Platform, AlertController, LoadingController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { User } from '../user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {  WhereFilterOp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { settings } from 'cluster';
import { ActionCodeSettings } from 'firebase/auth';
import { RegisterModalComponent } from './register-modal/register-modal.component';

@Injectable({
  providedIn: 'any'
})
export class AuthService {
  constructor(
    private router: Router, 
    private auth: AngularFireAuth, 
    private afs: AngularFirestore, 
    private platform: Platform, 
    private googlePlus: GooglePlus, 
    private modalCtrl: ModalController, 
    private alertController: AlertController, 
    private loadingController: LoadingController){}

  async registerNewUser(user: User){
    await this.afs.collection('User').add(user).then(
      () => {},
      (err) => {
        console.log(err);
      }
    );
  }

  async registerWithEmailPopUp(){
    const modal = await this.modalCtrl.create({
      component: RegisterModalComponent,
      cssClass: 'loginModal'
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

  async loginWithGoogle(){
    if(this.platform.is('android')){
      this.loginWithGooglePlus();
    } else {
      this.loginWithGooglePopUp();
    }
  }

  async loginWithGooglePopUp(){
    const popup = await this.loadingController.create({message: 'Ingresando...'});
    popup.present()
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider().addScope('https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile'))
      .then(async result => {
        console.log(result);
        if(result.additionalUserInfo.isNewUser){
          await this.registerNewUser({
            username: result.user.displayName, 
            firstName: (result.additionalUserInfo.profile as any).given_name,
            lastName: (result.additionalUserInfo.profile as any).family_name, 
            imgURL: result.user.photoURL,
            email: (result.additionalUserInfo.profile as any).email,
            joinDate: new Date(result.user.metadata.creationTime)
          });
        }

        popup.dismiss();
        this.router.navigate(['/app/home']);
      })
      .catch(() => {
        popup.message = "Cancelando...";
        popup.dismiss();
      });
  }

  async onGooglePlusLogin(accessToken: string, accessSecret: string){
    const credential = accessSecret ?
        firebase.auth.GoogleAuthProvider.credential(accessToken, accessSecret) :
        firebase.auth.GoogleAuthProvider.credential(accessToken);
    
    await this.auth.signInWithCredential(credential)
      .then(async result => {
        if(result.additionalUserInfo.isNewUser){
          await this.registerNewUser({
            username: result.user.displayName, 
            firstName: (result.additionalUserInfo.profile as any).given_name,
            lastName: (result.additionalUserInfo.profile as any).family_name, 
            imgURL: result.user.photoURL,
            email: (result.additionalUserInfo.profile as any).email,
            joinDate: new Date(result.user.metadata.creationTime)
          });
        }
      });
  }

  async loginWithGooglePlus(){
    const popup = await this.loadingController.create({message: 'Ingresando...'});
    popup.present()
    await this.googlePlus.login({scope: 'https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile', webClientId: environment.googleWebClientID})
      .then(async (response) => {
        const { idToken, accessToken } = response;
        await this.onGooglePlusLogin(idToken, accessToken);
        popup.dismiss();
        this.router.navigate(['/app/home']);
      })
      .catch(() => {
        popup.message = "Operación cancelada...";
        popup.dismiss();
      });
  }

  async loginWithFacebook(){
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  async loginWithEmailPopUp(){
    const modal = await this.modalCtrl.create({
      component: LoginModalComponent,
      cssClass: 'loginModal'
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    this.auth.signInWithEmailAndPassword(data.username, data.password).then(
      (success) => {
        console.log(success);
      },
      (err) => console.log("ERROR: " + err)
    );
  }

  async showAlertDialog(title: string, msg: any){
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['Ok']
    });

    await alert.present();
    return;
  }

  async getUserWhere(attribute: string, comparator: WhereFilterOp, value: string): Promise<User>{
    var user: User = null;

    const query = await this.afs.collection('User',
      (query =>
        query.where(attribute, comparator, value).limit(1)
      )
    )
    const snapshot = await query.ref.where(attribute, comparator, value).limit(1).get();
    if(!snapshot.empty){
      user = snapshot.docs[0].data() as User;
    }

    return user;
  }
}
