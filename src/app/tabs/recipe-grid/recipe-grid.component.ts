import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Recipe } from '../../recipe';

@Component({
  selector: 'app-recipe-grid',
  templateUrl: './recipe-grid.component.html',
  styleUrls: ['./recipe-grid.component.scss'],
})
export class RecipeGrid implements OnInit {
  @Input() Recipes: Recipe[];
  constructor() { }

  ngOnInit() {
  }

}
