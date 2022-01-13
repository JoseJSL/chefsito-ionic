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

      this.afs.collection<Recipe>('Recipe', q => q.where('Author.UID', '==', currentUser.uid)).get().subscribe(userRecipes => {
        this.UserRecipes = [];

        this.showUserRecipes = userRecipes.docs.length > 0 ? true: false;

        userRecipes.forEach(recipe => {
          this.UserRecipes.push(recipe.data());
        });

        if(this.UserRecipes.length == 1){
          this.userRecipesSwiper.updateSwiper({slidesPerView: 1});
        }
      });

      this.afs.collection('User').doc(currentUser.uid).collection<FavoriteRecipe>('Favorites').get().subscribe(async favorites => {
        this.UserFavorites = [] 

        this.showFavorites = favorites.docs.length > 0 ? true: false;
        
        for(var i = 0; i < favorites.docs.length; i++){
          this.UserFavorites.push(
            (await this.afs.collection<Recipe>('Recipe').doc(favorites.docs[i].id).get().toPromise()).data()
          );
        }

        if(this.UserFavorites.length == 1){
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
