import { Component, OnInit } from '@angular/core';
import { Recipe, Tip, Ingredient } from './recipe';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})
export class RecipePage implements OnInit {
  public Recipe: Recipe;
  public Tips: Tip[]
  public Ingredients: Ingredient[];
  public Steps: string[];

  constructor() {}

  ngOnInit() {
    this.Recipe = {
      Author: {Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'},
      AvgRating: 4.5,
      ImageURL: 'https://i.imgur.com/tiRb69w.jpg',
      PortionSize: 3,
      TimeMin: '30 min',
      Title: 'Lasagna como la del gato naranja'
    }

    this.Tips = [
      {Icon: 'time', Description: this.Recipe.TimeMin, Color: '#8BC34A'},
      {Icon: 'book', Description: 'Avanzado', Color: '#DF1A1A'},
      {Icon: 'hammer', Description: 'Martillo', Color: '#4CAF50'}
    ];
  }

}

// <color name="difficultyVeryHard">#FF7A0000</color>
// <color name="difficultyHard">#DF1A1A</color>
// <color name="difficultyKindaHard">#FFFF5722</color>
// <color name="difficultyNormal">#FFFF9800</color>
// <color name="difficultyKindaEasy">#FFFFEB3B</color>
// <color name="difficultyEasy">#8BC34A</color>
// <color name="difficultyVeryEasy">#4CAF50</color>
// <color name="difficultyBeginner">#00BCD4</color>