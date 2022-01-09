import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteRecipe, Recipe } from 'src/app/recipe';
import { defaultUser, User } from 'src/app/user';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-chefsito',
  templateUrl: './chefsito.component.html',
  styleUrls: ['./chefsito.component.scss'],
})
export class ChefsitoComponent implements OnInit {
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

  constructor(private afs: AngularFirestore, private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.afs.collection<User>('User').doc(params.uid).get().subscribe(user => {
        if(user){
          this.User = user.data();

          this.afs.collection<Recipe>('Recipe', q => q.where('Author.UID', '==', user.id)).valueChanges().subscribe(userRecipes => {
            this.UserRecipes = userRecipes;
            if(userRecipes.length == 0){
              this.showUserRecipes = false;
            } else if(this.UserRecipes.length == 1){
              this.userRecipesSwiper.updateSwiper({slidesPerView: 1});
            }
          });

          this.afs.collection('User').doc(user.id).collection<FavoriteRecipe>('Favorites').valueChanges({idField: 'UID'}).subscribe(favorites => {
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
        } else{
          this.router.navigate(['/app', 'home']);
        }
      });
    });
  }
}
