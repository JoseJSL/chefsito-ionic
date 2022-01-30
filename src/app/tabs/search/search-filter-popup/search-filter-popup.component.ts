import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dificultades } from '../../create-recipe/assets';
import { Categories, ExploreCategory } from '../../explore/explore-category';
import { Filter, FilterValue, orderByList } from '../filter';

@Component({
  selector: 'app-search-filter-popup',
  templateUrl: './search-filter-popup.component.html',
  styleUrls: ['./search-filter-popup.component.scss'],
})
export class SearchFilterPopupComponent implements OnInit {
  @Output() sendFilters = new EventEmitter<Filter>();

  public Filters: Filter;
  public Categories: ExploreCategory[] = Categories;
  public Difficulties: string[] = Dificultades;
  public OrderBy: FilterValue[] = orderByList;

  constructor(private activeRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(queryParams => {
      this.Filters = {category: '', search: '', orderBy: '', difficulty: -1}; 
        
      this.Filters.category = queryParams.category ? queryParams.category : '';
      this.Filters.search = queryParams.q ? queryParams.q : '';
      this.Filters.orderBy = queryParams.orderBy ? queryParams.orderBy : '';
      this.Filters.difficulty = queryParams.difficulty ? queryParams.difficulty : -1;
      this.sendFilters.emit(this.Filters);
    });
  }

  setCategory(cat: string){
    this.router.navigate(['/app', 'search'], {
      queryParams: {category: cat},
      queryParamsHandling: 'merge',
    });
  }

  setDifficulty(dif: number){
    this.router.navigate(['/app', 'search'], {
      queryParams: {difficulty: dif},
      queryParamsHandling: 'merge',
    });
  }

  setOrder(order: string){
    this.router.navigate(['/app', 'search'], {
      queryParams: {orderBy: order},
      queryParamsHandling: 'merge',
    });
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
