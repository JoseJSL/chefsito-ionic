import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { RecipeCardData } from './recipe-card-data';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public RecipeCollection: AngularFirestoreCollection<RecipeCardData>
  public Recipes: Observable<RecipeCardData[]>;

  constructor(private firestore: AngularFirestore) {
    // this.RecipeCollection = firestore.collection('Recipe');
    // this.Recipes = this.RecipeCollection.valueChanges();  
    // this.Recipes.forEach(v => console.log(v));
    // this.RecipeCollection.doc('Structure').collection('Rating').valueChanges().forEach(v => console.log(v));
  }
}
