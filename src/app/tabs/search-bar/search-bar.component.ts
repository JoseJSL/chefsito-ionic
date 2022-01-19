import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSearchbar, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/core/auth.service';
import { defaultUser, User } from 'src/app/user';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() defaultValue: string;
  public currentUserData: User;
  public profilePopover: HTMLIonPopoverElement;
  public searchField: FormControl;
  constructor(private menuCtrl: MenuController, private auth: AuthService, private builder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.searchField = this.builder.control('', [Validators.required, Validators.pattern(environment.stringRegex.username)]);

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

  search(searchBar: IonSearchbar){
    this.searchField.setValue(searchBar.value);

    if(this.searchField.valid){
      this.router.navigate(['/app', 'search'], {queryParams: 
        {
          q: searchBar.value
        }
      });
    }
  }
}
