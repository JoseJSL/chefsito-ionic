import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRefresher, PopoverController } from '@ionic/angular';
import { Recipe } from 'src/app/recipe';
import { Categories } from '../explore/explore-category';
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
  constructor(private afs: AngularFirestore, private popoverCtrl: PopoverController, private activeRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  async updateRecipes(Filters: Filter){
    this.defaultSearch = Filters.search;
    
    this.Recipes = [];
    this.afs.collection<Recipe>('Recipe').get().subscribe(recipeCollection => {
      recipeCollection.forEach(recipe => {
        const data = recipe.data();
        if(data.Title.toLowerCase().indexOf(Filters.search.toLowerCase()) > -1){
          this.Recipes.push(data);
        }
      });
    });
  }

  doRefresh(refresher: IonRefresher){
    this.updateRecipes(this.FiltersComponent.Filters);
    refresher.complete();
  }

  async openFilters(){
    this.FiltersComponent.show();
  }

  getCategoryName(urlName: string): string{
    for(var i = 0; i < Categories.length; i++){
      if(urlName == Categories[i].urlName){
        return Categories[i].title;
      }
    }

    return 'cualquiera';
  }
}
