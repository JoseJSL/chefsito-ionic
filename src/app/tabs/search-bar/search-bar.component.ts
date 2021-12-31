import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { MenuController, Platform, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/user';
import { ProfilePopoverComponent } from '../profile-popover/profile-popover.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  public isAndroid = false;
  public searchBarSlot = 'start';
  public avatarSlot = 'end';
  public currentUserData: User = null;
  public showUserData = false;
  public profilePopover: HTMLIonPopoverElement;
  constructor(private menuCtrl: MenuController, private platform: Platform,private authService: AuthService, private popoverCtrl: PopoverController) { }

  async ngOnInit() {
    if(this.platform.is('android')){
      this.searchBarSlot = "end";
      this.avatarSlot = "start";
      this.isAndroid = true;
    }

    this.currentUserData = await this.authService.getUserWhere('email', "==", localStorage.getItem("currentEmail"));

    if(this.currentUserData){
      if(!(this.currentUserData.imgURL.length > 1)){
        this.currentUserData.imgURL = 'assets/user-default.png'
      }
      this.showUserData = true;
    }
  }

  async showProfilePopover(){
    this.menuCtrl.enable(true, 'homeMenu');
    this.menuCtrl.open('homeMenu');
  }

  async logout(){
    await this.menuCtrl.close('homeMenu');
    await this.authService.logout();
  }
}
