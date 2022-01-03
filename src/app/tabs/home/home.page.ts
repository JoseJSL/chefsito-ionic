import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Recipe } from '../../recipe';

@Component({
  selector: 'app-home-tab',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{
  public Recipes: Recipe[];
  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.Recipes = [];
    this.afs.collection<Recipe>('Recipe').valueChanges({idField: 'UID'}).subscribe(recipeCollection => {
      var newRecipes: Recipe[] = [];
      recipeCollection.forEach(recipe => {
        newRecipes.push(recipe);
      });
      this.Recipes = newRecipes;
    });
    console.log(this.Recipes);
  }

}
