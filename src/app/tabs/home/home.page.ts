import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonRefresher } from '@ionic/angular';
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
    this.updateRecipes();
  }

  async updateRecipes(){
    this.Recipes = [];
    this.afs.collection<Recipe>('Recipe').get().subscribe(recipeCollection => {
      recipeCollection.forEach(recipe => {
        this.Recipes.push(recipe.data());
      });
    });
  }

  doRefresh(refresher: IonRefresher){
    this.updateRecipes()
    refresher.complete();
  }

}
