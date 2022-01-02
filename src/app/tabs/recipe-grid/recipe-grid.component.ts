import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Recipe } from '../recipe-page/recipe';

@Component({
  selector: 'app-recipe-grid',
  templateUrl: './recipe-grid.component.html',
  styleUrls: ['./recipe-grid.component.scss'],
})
export class RecipeGrid implements OnInit {
  public Recipes: Recipe[];
  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.afs.collection<Recipe>('Recipe').valueChanges().subscribe(recipeCollection => {
      recipeCollection.forEach(recipe => {
        var i = this.Recipes.indexOf(recipe);
        i = (i >= 0) ? i : this.Recipes.length;
        this.Recipes[i] = recipe;
      });
    });
  }

}
