import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonIcon, IonItem } from '@ionic/angular';
import { FavoriteRecipe, Recipe } from 'src/app/recipe';
import { defaultUser, User } from 'src/app/user';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('userRecipesSwiper') userRecipesSwiper: SwiperComponent;
  @ViewChild('favRecipesSwiper') favRecipesSwiper: SwiperComponent;
  public User: User = defaultUser;
  public UserRecipes: Recipe[] = [];
  public showUserRecipes = true;
  public UserFavorites: Recipe[] = [];
  public showFavorites = true;
  public swiperConfig: SwiperOptions = {
    observer: true,
    navigation: true,
    slidesPerView: 1,
    breakpoints: {
      768:{
        slidesPerView: 2,
      }
    },
  }

  constructor(private auth: AngularFireAuth, private afs: AngularFirestore) { }

  ngOnInit() {
    this.auth.user.subscribe(currentUser => {
      this.afs.collection<User>('User').doc(currentUser.uid).valueChanges().subscribe(userData => {
        this.User = userData;
      });

      this.afs.collection<Recipe>('Recipe', q => q.where('Author.UID', '==', currentUser.uid)).valueChanges().subscribe(userRecipes => {
        this.UserRecipes = userRecipes;
        if(userRecipes.length == 0){
          this.showUserRecipes = false;
        } else if(this.UserRecipes.length == 1){
          this.userRecipesSwiper.updateSwiper({slidesPerView: 1});
        }
      });

      this.afs.collection('User').doc(currentUser.uid).collection<FavoriteRecipe>('Favorites').valueChanges({idField: 'UID'}).subscribe(favorites => {
        this.UserFavorites = [];
        for(let i = 0; i < favorites.length; i++){
          this.afs.collection<Recipe>('Recipe').doc(favorites[i].UID).valueChanges().subscribe(recipe =>{
            this.UserFavorites[i] = recipe;
          });
        }
        if(favorites.length == 0){
          this.showFavorites = false;
        } else if(favorites.length == 1){
          this.favRecipesSwiper.updateSwiper({slidesPerView: 1});
        }
      });
    });
  }

  enableEdit(icon: IonIcon,items: IonItem[]){
    icon.name = items[0].disabled ? 'checkmark' : 'pencil';
    items.forEach(item => item.disabled = !item.disabled);
  }
}
