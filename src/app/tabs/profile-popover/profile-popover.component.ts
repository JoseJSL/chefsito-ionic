import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss'],
})
export class ProfilePopoverComponent implements OnInit {

  constructor(private platform: Platform ,private auth: AngularFireAuth, private router: Router, private popoverCtrl: PopoverController, private googlePlus: GooglePlus) { }

  ngOnInit() {}


  async logout(){
    if(this.platform.is('android')){
      await this.googlePlus.disconnect();
    }
    await this.popoverCtrl.dismiss('profilePopover');
    await this.auth.signOut();
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }
}
