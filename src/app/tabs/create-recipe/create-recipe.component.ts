import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonIcon, IonInput, IonSegment, IonSelect, IonTextarea } from '@ionic/angular';
import { defaultRecipeCreator, defaultRecipeData, Recipe, RecipeData } from 'src/app/recipe';
import { User } from 'src/app/user';
import { SwiperComponent } from 'swiper/angular';
import { CustomIcon, foodIcons, kitchenIcons, Medida, Medidas, Dificultades, DifficultyColors } from './assets';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss'],
})
export class CreateRecipeComponent implements OnInit {
  public Recipe: Recipe = defaultRecipeCreator;
  public RecipeData: RecipeData = defaultRecipeData;
  public originalPortionSize: number;
  public recipeForm: FormGroup | undefined;
  public ingredientForm: FormGroup | undefined;
  public stepForm: FormGroup | undefined;
  public foodIcons: CustomIcon[] = foodIcons;
  public kitchenIcons: CustomIcon[] = kitchenIcons;
  public Medidas: Medida[] = Medidas;
  public Dificultades: string[] = Dificultades;
  constructor(private builder: FormBuilder, private auth: AngularFireAuth, private afs: AngularFirestore) {}

  ngOnInit() {
    this.recipeForm = this.builder.group({
      Title: this.builder.control('', [Validators.required]),
      TimeMin: this.builder.control('', [Validators.required]),
      Difficulty: this.builder.control('', [Validators.required]),
      Utensilio: this.builder.control('', [Validators.required]),
    });

    this.ingredientForm = this.builder.group({
      Cantidad: this.builder.control('', [Validators.required, Validators.min(1)]),
      Medida: this.builder.control('', [Validators.required]),
      Nombre: this.builder.control('', [Validators.required]),
      IngredientIcon: this.builder.control('help', [Validators.required]),      
    });
  }

  segmentChanged(ev: any, segments: SwiperComponent){
    const selected = ev.detail.value;
    switch(selected){
      case "summary":
      segments.swiperRef.slideTo(0);
        break;
      default:
        segments.swiperRef.slideTo(1);
        break;
    }
    segments.swiperRef.el.scrollTop = 0;
  }

  sliderSwiped(segments: SwiperComponent, segmentSelector: IonSegment){
    switch(segments.swiperRef.realIndex){
      case 0:
        segmentSelector.value = "summary";
        break;
      default:
        segmentSelector.value = "steps";
        break;
    }
    segments.swiperRef.el.scrollTop = 0;
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

  createRecipe(): boolean{
    const data = this.recipeForm.controls;
    this.Recipe.Title = data['Title'].value;
    this.Recipe.TimeMin = data['TimeMin'].value;

    this.RecipeData.Tips[0].Description = data['TimeMin'].value;
    this.RecipeData.Tips[0].Color = '';
    return true
  }

  confirmRecipe(){
    if(this.createRecipe()){
      this.auth.user.subscribe(user => {
        this.afs.collection<User>('User').doc(user.uid).valueChanges().subscribe(userData => {
          console.log(userData);
          this.Recipe.Author = {UID: user.uid, Name: userData.username, ImgURL: userData.imgURL};
          this.afs.collection<Recipe>('Recipe').add(this.Recipe).then(recipe => {
            console.log(recipe);
            recipe.collection('Data').doc('Values').set(this.RecipeData);
          });
        });
      });
    }
  }
  addIngredient(inputs: IonInput[], selects: IonSelect[], icons: IonIcon[]){
    if(this.ingredientForm.valid){
      this.RecipeData.Ingredients.push({
        Icon: this.ingredientForm.controls['IngredientIcon'].value,
        Name: this.ingredientForm.controls['Nombre'].value,
        Quantity: this.ingredientForm.controls['Cantidad'].value,
        QuantityType: {
          For: 'any',
          Name: (this.ingredientForm.controls['Medida'].value as string).split(',')[0],
          Short: (this.ingredientForm.controls['Medida'].value as string).split(',')[1],
        },
      });

      inputs.forEach(input => {
        input.value = '';
      });
  
      selects.forEach(select => {
        select.value = select.name.includes('Icon') ? 'help' : null;
      });
  
      icons.forEach(icon => {
        icon.name = 'help';
      });
    }
  }

  addStep(input: IonTextarea){
    if(input.value.length > 0){
      this.RecipeData.Steps.push(input.value);
      input.value = "";
    }
  }

  updateInputValue(formGroup: FormGroup, input: IonInput){
    formGroup.controls[input.name].setValue(input.value);
    input.color = formGroup.controls[input.name].valid ? "success" : "danger";
  }

  updateSelectValue(formGroup: FormGroup, select: IonSelect){
    formGroup.controls[select.name].setValue(select.value);
    //select.style.color = formGroup.controls[select.name].valid ? "#2fdf75" : "#ff4961";
  }

  updateDificultad(select: IonSelect){
    this.RecipeData.Tips[1].Description = Dificultades[select.value];
    this.RecipeData.Tips[1].Color = DifficultyColors[select.value];
  }

  updateUtensilio(select: IonSelect){
    this.RecipeData.Tips[2].Icon = this.kitchenIcons[select.value].Source;
    this.RecipeData.Tips[2].Description = this.kitchenIcons[select.value].Display;
    this.RecipeData.Tips[2].Color = '';
  }
}
