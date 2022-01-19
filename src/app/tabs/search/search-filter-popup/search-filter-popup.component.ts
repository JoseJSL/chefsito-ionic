import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dificultades } from '../../create-recipe/assets';
import { Categories, ExploreCategory } from '../../explore/explore-category';
import { Filter, FilterValue, orderByList } from '../filter';

@Component({
  selector: 'app-search-filter-popup',
  templateUrl: './search-filter-popup.component.html',
  styleUrls: ['./search-filter-popup.component.scss'],
})
export class SearchFilterPopupComponent implements OnInit {
  @Output() sendFilter = new EventEmitter<Filter>();

  public Filters: Filter;
  public Categories: ExploreCategory[] = Categories;
  public Difficulties: string[] = Dificultades;
  public OrderBy: FilterValue[] = orderByList;

  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(queryParams => {
      this.activeRoute.params.subscribe(params => {
        this.Filters = {category: '', search: '', orderBy: '', difficulty: ''}; 
        
        this.Filters.category = params.category ? params.category : '';
        this.Filters.search = queryParams.q ? queryParams.q : '';
        this.Filters.orderBy = queryParams.orderBy ? queryParams.orderBy : '';
        this.Filters.difficulty = queryParams.difficulty ? queryParams.difficulty : '';
        this.sendFilter.emit(this.Filters);
      });
    });
  }

  setCategory(cat: string){
    this.Filters.category = cat;
    this.sendFilter.emit(this.Filters);
  }

  setDifficulty(dif: string){
    this.Filters.difficulty = dif;
    this.sendFilter.emit(this.Filters);
  }

  setOrder(order: string){
    this.Filters.orderBy = order;
    this.sendFilter.emit(this.Filters);
  }

  async show(){
    const content = document.getElementById('filterContent');

    if(content.style.maxHeight == '0px'){
      content.style.maxHeight = '100%';
    } else {
      content.style.maxHeight = '0px';
    }
  }
}
