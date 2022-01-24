import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { IonRefresher } from '@ionic/angular';
import { Recipe } from 'src/app/recipe';
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
  constructor(private afs: AngularFirestore) {}

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
    const FiltersCopy = Filters;

    this.afs.collection<Recipe>('Recipe').get().subscribe(recipes => {
      this.Recipes = [];
      this.filterByTextAndAdd(recipes, FiltersCopy.search);
    });
  }

  filterRecipes(collection: QuerySnapshot<Recipe>, Filters: Filter){
    if(Filters.category.length > 0){
      collection.query.where('Category', "==", Filters.category);
      Filters.category = '';
      return this.filterRecipes(collection, Filters);
    } else if(Filters.difficulty.length > 0){
      collection.query.where('Difficulty', "==", Filters.difficulty);
      Filters.difficulty = '';
      return this.filterRecipes(collection, Filters);
    } else if(Filters.orderBy.length > 0 ){
      //Ordenar por
    } else if(Filters.search.length > 0){
      const text = Filters.search;
      Filters.search = '';
      return this.filterByTextAndAdd(collection, text);
    }
  }

  filterByTextAndAdd(collection: QuerySnapshot<Recipe>, text: string): QuerySnapshot<Recipe>{
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
    
    console.log(words.length);
    for(i = 0; i < collection.size; i++){
      recipe = collection.docs[i].data();

      for(j = 0; j < words.length; j++){
        if(recipe.Title.toLowerCase().includes(words[j])){
          this.Recipes.push(recipe);
          j = words.length;
        }
      }
    }

    return collection;
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
