import { Component, OnInit } from '@angular/core';
import { IonRefresher } from '@ionic/angular';
import { AuthService } from 'src/app/core/auth.service';
import { FavoriteRecipe, Recipe } from '../../recipe';

@Component({
  selector: 'app-favorites-tab',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss']
})

export class FavoritesPage implements OnInit{
  public FavoritedRecipes: Recipe[];
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.updateRecipes();
  }

  updateRecipes(){
    this.auth.auth.user.subscribe(user => {
      this.auth.afs.collection('User').doc(user.uid).collection<FavoriteRecipe>('Favorites').valueChanges({idField: 'id'}).subscribe(favorites => {
        this.FavoritedRecipes = [];
        favorites.forEach(fav => {
          this.auth.afs.collection<Recipe>('Recipe').doc(fav.id).get().subscribe(recipe => {
            this.FavoritedRecipes.push(recipe.data());
          });
        })
      });
    });
  }

  doRefresh(refresher: IonRefresher){
    this.updateRecipes()
    refresher.complete();
  }
}
