import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

  constructor(private auth: AngularFireAuth, private platform: Platform, private googlePlus: GooglePlus) { }

  ngOnInit() {}

  async tryLoginGoogle(){
    var loginResult;

    if(this.platform.is('android')){
      loginResult = this.googlePlus.login({webClientID: '1029740896252-tjsdhsu5r4fc25vd99lktnno5ofl9p2s.apps.googleusercontent.com'})
        .then(res => loginResult = res)
        .catch(err => this.showGooglePlusError(err));
    } else {
      loginResult = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

  }

  tryLoginFacebook(){
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  } 

  showGooglePlusError(err){
    console.log(err);
  }
}
