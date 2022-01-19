import { Component, OnInit } from '@angular/core';
import { Categories, ExploreCategory } from '../explore-category';

@Component({
  selector: 'app-explore-card',
  templateUrl: './explore-card.component.html',
  styleUrls: ['./explore-card.component.scss'],
})
export class ExploreCardComponent implements OnInit {
  public imgUrl: string;
  public title: string;
  public categories: ExploreCategory[] = Categories;
  constructor() {}

  ngOnInit() {}
}
