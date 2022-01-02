import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { defaultUser, User } from 'src/app/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  public currentUserData: User;
  constructor(private auth: AuthService, private menuCtrl: MenuController) { }

  async ngOnInit() {
    this.currentUserData = defaultUser;
    this.auth.auth.user.subscribe(user => {
      if(user){
        this.auth.afs.collection<User>('User').doc(user.uid).valueChanges().subscribe(data => {
          this.currentUserData = data;
        });
      }
    });
  }

  async showProfilePopover(){
    this.menuCtrl.enable(true, 'homeMenu');
    this.menuCtrl.open('homeMenu');
  }

  logout(){
    this.menuCtrl.close('homeMenu');
    this.menuCtrl.enable(false, 'homeMenu');
    this.auth.logout();
  }
}
