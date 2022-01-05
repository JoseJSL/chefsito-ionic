import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonIcon, IonItem } from '@ionic/angular';
import { defaultUser, User } from 'src/app/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public User: User = defaultUser;
  private originialUserData: User;
  constructor(private auth: AngularFireAuth, private afs: AngularFirestore) { }

  ngOnInit() {
    this.auth.user.subscribe(currentUser => {
      this.afs.collection<User>('User').doc(currentUser.uid).valueChanges().subscribe(userData => {
        this.User = userData;
        this.originialUserData = userData;
      });
    });
  }

  enableEdit(icon: IonIcon,items: IonItem[]){
    icon.name = items[0].disabled ? 'checkmark' : 'pencil';
    items.forEach(item => item.disabled = !item.disabled);
  }
}
