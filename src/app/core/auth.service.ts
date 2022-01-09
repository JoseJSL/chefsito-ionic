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
import { RegisterModalComponent } from './register-modal/register-modal.component';

@Injectable({
  providedIn: 'any'
})
export class AuthService {
  constructor(
    public afs: AngularFirestore, 
    public auth: AngularFireAuth, 
    private router: Router, 
    private platform: Platform, 
    private googlePlus: GooglePlus, 
    private modalCtrl: ModalController, 
    private alertController: AlertController, 
    private loadingController: LoadingController){}

  async registerNewUser(uid: string, user: User){
    await this.afs.collection<User>('User').doc(uid).set(user);
  }

  async registerWithEmailPopUp(){
    const modal = await this.modalCtrl.create({
      component: RegisterModalComponent,
      cssClass: 'loginModal'
    });
    await modal.present();

    const { data } = await modal.onDidDismiss(); 

    if(data){
      const popup = await this.loadingController.create({message: 'Registrando...'});
      popup.present()
      const user: User = {username: data.username, firstName: data.firstName, lastName: data.lastName, email: data.email, imgURL: 'assets/user-default.png', joinDate: new Date()};
      await this.auth.createUserWithEmailAndPassword(data.email, data.password)
        .then(
          async (result) => {
            await this.registerNewUser(result.user.uid, user);
            popup.dismiss();
            this.showAlertDialog("", "¡La cuenta se ha creado con éxito!");
          }
        )
        .catch(err => {
          popup.dismiss();
          this.showAlertDialog("Error al registrar cuenta.", err);
        });
    } 
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
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider)
      .then(async result => {
        if(result.additionalUserInfo.isNewUser){
          await this.registerNewUser(result.user.uid, {
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
          await this.registerNewUser(result.user.uid, {
            username: result.user.displayName, 
            firstName: (result.additionalUserInfo.profile as any).given_name,
            lastName: (result.additionalUserInfo.profile as any).family_name, 
            imgURL: result.user.photoURL,
            email: result.user.email,
            joinDate: new Date(result.user.metadata.creationTime)
          });
        }
      });
  }

  async loginWithGooglePlus(){

    this.googlePlus.login({scope: 'https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile', webClientId: environment.googleWebClientID})
      .then(async (response) => {
        const popup = await this.loadingController.create({message: 'Ingresando...'});
        popup.present()
        const { idToken, accessToken } = response;
        await this.onGooglePlusLogin(idToken, accessToken);
        popup.dismiss();
        this.router.navigate(['/app', 'home']);
      })
      .catch((e) => {
        console.log(e);
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
    if(data){
      const popup = await this.loadingController.create({message: 'Ingresando...'});
      popup.present()

      await this.auth.signInWithEmailAndPassword(data.username, data.password).then(
        () => {
          popup.dismiss();
          this.router.navigate(['/app/home']);
        },
        (err) =>{
          popup.dismiss();
          this.loginWithEmailPopUp();
          this.showAlertDialog("Error al inciar sesión.", err);
        }
      ); 
    }
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

  async logout(){
    const popup = await this.loadingController.create({message: 'Cerrando sesión...'});
    popup.present()

    if(this.platform.is('android')){
      this.googlePlus.disconnect();
    }

    await this.auth.signOut();
    popup.dismiss()
    this.router.navigate(['/welcome']);
  }
}
