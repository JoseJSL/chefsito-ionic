import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { IonRefresher } from '@ionic/angular';
import { Recipe } from 'src/app/recipe';
import { Dificultades } from '../create-recipe/assets';
import { Filter } from './filter';
import { SearchFilterPopupComponent } from './search-filter-popup/search-filter-popup.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements OnInit {
  @ViewChild('filters') FiltersComponent: SearchFilterPopupComponent;

  public defaultSearch: string;
  public Recipes: Recipe[];
  constructor(private afs: AngularFirestore, private activeRoute: ActivatedRoute) {}

  ngOnInit() {}

  doRefresh(refresher: IonRefresher){
    this.updateRecipes(this.FiltersComponent.Filters);
    refresher.complete();
  }

  async openFilters(){
    this.FiltersComponent.show();
  }

  async updateRecipes(Filters: Filter){
    this.defaultSearch = Filters.search;

    this.Recipes = [];
    this.filterRecipes(Filters);  
  }

  filterRecipes(Filters: Filter){
    this.afs.collection<Recipe>('Recipe', ref => {
      var recipeRef: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;

      if(Filters.category.length > 0){
        recipeRef = recipeRef.where('Category', 'array-contains', Filters.category);
      }
  
      if(Filters.difficulty > -1){
        recipeRef = recipeRef.where('Difficulty', '==', Dificultades[Filters.difficulty]);
      }
  
      if(Filters.orderBy.length > 0){
        if(Filters.orderBy === 'rating'){
          recipeRef = recipeRef.orderBy('AvgRating', 'desc')  ;
        }
      }
      return recipeRef;
    }).get().subscribe(recipes => {
      if(Filters.search.length > 0){
        this.filterByTextAndAdd(recipes, Filters.search);
      } else {
        recipes.forEach(r => this.Recipes.push(r.data()));
      }
    });
  }
  
  filterByTextAndAdd(collection: QuerySnapshot<Recipe>, text: string){
    var i, j: number;
    var recipe: Recipe

    var words: string[] = text.toLowerCase().split(/[ ]+/);
    const wordsBack = [... words];

    for(i = 0; i < words.length; i++){
      if(!this.isNotWordConnector(words[i])){
        words.splice(i, 1);
      }
    }

    if(words.length < 1){
      words = wordsBack;
    }
    
    for(i = 0; i < collection.size; i++){
      recipe = collection.docs[i].data();

      for(j = 0; j < words.length; j++){
        if(recipe.Title.toLowerCase().includes(words[j])){
          this.Recipes.push(recipe);
          j = words.length;
        }
      }
    }
  }

  isNotWordConnector(word: string){
    if(word == 'a'){
      return false;
    } else if(word == 'con'){
      return false;
    } else if(word == 'de'){
      return false;
    } else if(word == 'del'){
      return false;
    } else if(word == 'la'){
      return false;
    } else if(word == 'sobre'){
      return false;
    } else if(word == 'y'){
      return false;
    }

    return true;
  }
}
