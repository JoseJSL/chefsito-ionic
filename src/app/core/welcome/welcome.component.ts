import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  constructor(private auth: AuthService){}
  ngOnInit() {}

  tryLoginGoogle(){
    this.auth.loginWithGoogle();
  }
  tryLoginFacebook(){
    this.auth.loginWithFacebook();
  } 

  tryLoginEmail(){
    this.auth.loginWithEmailPopUp();
  }

  async tryRegisterEmail(){
    this.auth.registerWithEmailPopUp();
    //var user: User = await this.auth.getUserWhere('email', '==', 'josehyvy3@gmail.com');
  }

}
