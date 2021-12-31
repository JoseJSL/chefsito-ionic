import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MenuController } from '@ionic/angular';
import { User } from 'src/app/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  public currentUserData: User;
  public showUserData: boolean;
  constructor(private fireAuth: AngularFireAuth,private auth: AuthService, private menuCtrl: MenuController) { }

  async ngOnInit() {
    this.fireAuth.onAuthStateChanged(
      async (user) => {
        if(user){
          this.currentUserData = await this.auth.getUserWhere('email', "==", user.email);
      
          if(this.currentUserData){
            if(!(this.currentUserData.imgURL.length > 1)){
              this.currentUserData.imgURL = 'assets/user-default.png'
            }
            this.showUserData = true;
          }
        } else {
          this.currentUserData = null;
          this.showUserData = false;
          this.menuCtrl.close('homeMenu');
          this.menuCtrl.enable(false, 'homeMenu');
        }
      }
    );
  }

  async showProfilePopover(){
    this.menuCtrl.enable(true, 'homeMenu');
    this.menuCtrl.open('homeMenu');
  }

  async logout(){
    await this.menuCtrl.close('homeMenu');
    await this.auth.logout();
  }
}
