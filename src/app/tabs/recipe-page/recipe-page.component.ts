import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeData } from './recipe';
import { IonSegment } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})
export class RecipePage implements OnInit {
  public Recipe: Recipe;
  public RecipeData: RecipeData;
  public currentSegment: number = 0;
  public originalPortionSize: number;

  constructor(private afs: AngularFirestore ,private router: Router, private activeRoute: ActivatedRoute) { }

  replaceOnInit(){
    this.activeRoute.params.subscribe(params => {
      const recipeDoc = this.afs.collection<Recipe>('Recipe').doc(params.uid);
      recipeDoc.valueChanges().subscribe(recipe => {
        if(recipe){
          console.log('Receta: ' + recipe);
          recipeDoc.collection<RecipeData>('Data').doc('value').valueChanges(recipeData => {
            console.log('Data: ' + recipeData);
          });
        } else {
          this.router.navigate(['app', 'home']);
        }
      });
    });
  }

  ngOnInit() {
    this.replaceOnInit();
    this.Recipe = {
      UID: 'test',
      Author: {Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'},
      AvgRating: 4.5,
      ImageURL: 'https://i.imgur.com/tiRb69w.jpg',
      PortionSize: 3,
      TimeMin: '30 min',
      Title: 'Lasagna como la del gato naranja'
    }

    this.RecipeData = {
      Tips: [
        {Icon: 'time', Description: this.Recipe.TimeMin, Color: '#8BC34A'},
        {Icon: 'book', Description: 'Avanzado', Color: '#DF1A1A'},
        {Icon: 'kitchen-horno', Description: 'Horno', Color: '#4CAF50'}
      ],
      Ingredients: [
        {Icon: 'food-alcohol' ,Name: 'Vino tinto', Quantity: 200, QuantityType: {For: 'Liquidos', Name:'Mililitros', Short: 'ml'}},
        {Icon: 'food-carne',Name: 'Carne ternera para guisar', Quantity: 600, QuantityType: {For: 'Solidos', Name:'Gramos', Short: 'gr'}},
        {Icon: 'food-zanahoria' ,Name: 'Zanahoria', Quantity: 2, QuantityType: {For: 'Unidades', Name:'Unidades', Short: ''}},
        {Icon: 'food-huevo', Name: 'Huevos', Quantity: 2, QuantityType: {For: 'Unidades', Name:'Unidades', Short: ''}},
        {Icon: 'food-carne',Name: 'Panceta de cerdo', Quantity: 300, QuantityType: {For: 'Solidos', Name:'Gramos', Short: 'gr'}},
      ],
      Steps: [
        "Calentamos una cazuela grande de agua, la más ancha de casa. Cuando empiece a hervir echamos 2 puñados generosos de sal.",
        "Introducimos las láminas de lasaña una a una sin que se toquen (para que no se peguen entre ellas). Ahora podemos encontrar infinidad de tipos de lasaña donde no hace hidratarla como se hacía antes. En casa muchas veces para ahorrar tiempo empleo las que se hidratan con la bechamel y el jugo que suelta la salsa al hornear.",
        "Si lo hacéis de la manera tradicional tenemos que remover con una cuchara de madera y en unos 10 minutos sacamos las láminas. Las estiramos encima de unas hojas de papel absorbente de cocina. Aunque os parezca que no están, acabarán haciéndose en el horno.",
        "El siguiente paso será lavar muy bien todas las verduras que vamos a emplear en el relleno. En la receta os aconsejo el relleno de la clásica salsa boloñesa, zanahorias, ajo, pimientos y cebolla.",
        "El siguiente paso otra vez será lavar muy bien todas las verduras que vamos a emplear en el relleno. En la receta os aconsejo el relleno de la clásica salsa boloñesa, zanahorias, ajo, pimientos y cebolla.",  
        "El siguiente paso otra vez será lavar muy bien todas las verduras que vamos a emplear en el relleno. En la receta os aconsejo el relleno de la clásica salsa boloñesa, zanahorias, ajo, pimientos y cebolla.",  
        "El siguiente paso otra vez será lavar muy bien todas las verduras que vamos a emplear en el relleno. En la receta os aconsejo el relleno de la clásica salsa boloñesa, zanahorias, ajo, pimientos y cebolla.",  
        "El siguiente paso otra vez será lavar muy bien todas las verduras que vamos a emplear en el relleno. En la receta os aconsejo el relleno de la clásica salsa boloñesa, zanahorias, ajo, pimientos y cebolla.",  
        "El siguiente paso otra vez será lavar muy bien todas las verduras que vamos a emplear en el relleno. En la receta os aconsejo el relleno de la clásica salsa boloñesa, zanahorias, ajo, pimientos y cebolla.",  
        "El siguiente paso otra vez será lavar muy bien todas las verduras que vamos a emplear en el relleno. En la receta os aconsejo el relleno de la clásica salsa boloñesa, zanahorias, ajo, pimientos y cebolla.",  
      ],
      Ratings: [
        {Rating: 5, User:'Alguien', UserImageURL: 'https://i.imgur.com/JgjqbN3.png'}
      ]
    }

    this.originalPortionSize = this.Recipe.PortionSize;
  }

  segmentChanged(ev: any, segments: SwiperComponent){
    const selected = ev.detail.value;
    switch(selected){
      case "summary":
      segments.swiperRef.slideTo(0);
        break;
      case "steps":
        segments.swiperRef.slideTo(1);
        break;
      default:
        segments.swiperRef.slideTo(2);
        break;
    }
  }

  sliderSwiped(ev: any, segmentSelector: IonSegment){
    switch(ev.activeIndex){
      case 0:
        segmentSelector.value = "summary";
        break;
      case 1:
        segmentSelector.value = "steps";
        break;
      default:
        segmentSelector.value = "comments";
        break;
    }
  }

  changePortionSize(size: number){
    if(this.Recipe.PortionSize + size >= 1){
      this.Recipe.PortionSize += size;
    }
  }
  
  roundTo(num: number, places: number) {
    const factor = 10 * places;
    return Math.round(num * factor) / factor;
  }

  startAssistant(){
    this.router.navigate(['/app', 'recipe', this.Recipe.UID, 'steps']);
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