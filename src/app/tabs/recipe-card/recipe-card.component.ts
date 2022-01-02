import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe-page/recipe';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent implements OnInit {
  @Input('recipe') Recipe: Recipe;
  constructor() { }

  ngOnInit() {}

}
