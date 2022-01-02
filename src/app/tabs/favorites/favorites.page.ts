import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Recipe } from '../recipe-page/recipe';

interface FavoriteRecipe{
  addedAt: Date,
}

@Component({
  selector: 'app-favorites-tab',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss']
})

export class FavoritesPage implements OnInit{
  public FavoritedRecipes: Recipe[];
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.FavoritedRecipes = [];
    //Todo esto es funcional. No borrar
    // this.auth.auth.user.subscribe(user => {
    //   this.auth.afs.collection('User').doc(user.uid).collection<FavoriteRecipe>('Favorite').valueChanges({idField: 'uid'}).subscribe(favoritesCollection => {
    //     favoritesCollection.forEach(favRecipe => {
    //       this.auth.afs.collection<Recipe>('Recipe').doc(favRecipe.uid).valueChanges().subscribe(recipe =>{
    //         if(recipe){
    //           var i = this.FavoritedRecipes.indexOf(recipe);
    //           i = (i >= 0) ? i: this.FavoritedRecipes.length;
    //           this.FavoritedRecipes[i] = recipe;
    //         }
    //       });
    //     });
    //   });
    // });
  }
}
