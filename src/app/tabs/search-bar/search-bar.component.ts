import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/core/auth.service';
import { defaultUser, User } from 'src/app/user';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  public currentUserData: User;
  public profilePopover: HTMLIonPopoverElement;
  constructor(private menuCtrl: MenuController, private auth: AuthService) { }

  ngOnInit() {
    this.currentUserData = defaultUser;
    this.auth.auth.onAuthStateChanged(user => {
      if(user){
        this.auth.afs.collection<User>('User').doc(user.uid).valueChanges().subscribe(data => {
          this.currentUserData = data;
        });
      }
    });
  }

  showProfilePopover(){
    this.menuCtrl.enable(true, 'homeMenu');
    this.menuCtrl.open('homeMenu');
  }

  async logout(){
    await this.menuCtrl.close('homeMenu');
    await this.auth.logout();
  }
}
