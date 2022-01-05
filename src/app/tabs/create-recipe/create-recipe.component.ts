import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonIcon, IonInput, IonSegment, IonSelect, IonTextarea, LoadingController, Platform } from '@ionic/angular';
import { defaultRecipeCreator, defaultRecipeData, Recipe, RecipeData } from 'src/app/recipe';
import { User } from 'src/app/user';
import { SwiperComponent } from 'swiper/angular';
import { CustomIcon, foodIcons, kitchenIcons, Medida, Medidas, Dificultades, DifficultyColors } from './assets';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss'],
})
export class CreateRecipeComponent implements OnInit {
  private imgFile: any;
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
  constructor(
    private fireStorage: AngularFireStorage, 
    private imagePicker: ImagePicker, 
    private androidFile: File, 
    private platform: Platform, 
    private builder: FormBuilder,
    private authService: AuthService,
    private load: LoadingController) {}

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

  async createRecipe(): Promise<boolean>{
    if(!this.recipeForm.valid){
      this.authService.showAlertDialog('Error al crear receta.', 'Asegurese de que no falte ningún campo y vuelva a intentarlo');
      return false;
    }

    if(this.Recipe.ImgURL == 'assets/food-tray.jpg'){
      this.authService.showAlertDialog('Error al crear receta.', 'Agregue una imagen.');
      return false
    }

    if(this.RecipeData.Steps.length == 0){
      this.authService.showAlertDialog('Error al crear receta.', 'La receta no contiene pasos.');
      return false;
    } else if(this.RecipeData.Ingredients.length == 0){
      this.authService.showAlertDialog('Error al crear receta.', 'La receta no contiene ingredientes.');
      return false;
    }

    const data = this.recipeForm.controls;
    this.Recipe.Title = data['Title'].value;
    this.Recipe.TimeMin = data['TimeMin'].value;
    this.RecipeData.Tips[0].Description = data['TimeMin'].value
    //this.Recipe.AvgRating = 5;
    this.Recipe.UID = this.authService.afs.createId();

    const uploaded = await this.fireStorage.storage.ref(this.Recipe.UID).put(this.imgFile);
    this.Recipe.ImgURL = await uploaded.ref.getDownloadURL();
    return true;
  }

  async confirmRecipe(){
    if(await this.createRecipe()){
      const loading = await this.load.create({message: 'Creeando receta...'});
      loading.present();
      this.authService.auth.user.subscribe(async user => {
        this.authService.afs.collection<User>('User').doc(user.uid).get().subscribe(data => {
          const userData = data.data();
          this.Recipe.Author = {UID: user.uid, Name: userData.username, ImgURL: userData.imgURL};
          this.authService.afs.collection<Recipe>('Recipe').doc(this.Recipe.UID).set(this.Recipe);
          this.authService.afs.collection('Recipe').doc(this.Recipe.UID).collection<RecipeData>('Data').doc('Values').set(this.RecipeData);
        });
      });
      loading.dismiss();
      this.authService.showAlertDialog('', '¡La receta ha sido creada!');
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
    } else {
      this.authService.showAlertDialog('No se agregó el ingrediente.', 'Rellene todos los campos y vuelva a intentarlo');
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
    this.recipeForm.controls[select.name].setValue(Dificultades[select.value]);
  }

  updateUtensilio(select: IonSelect){
    this.RecipeData.Tips[2].Icon = this.kitchenIcons[select.value].Source;
    this.RecipeData.Tips[2].Description = this.kitchenIcons[select.value].Display;
    this.RecipeData.Tips[2].Color = '';
    this.recipeForm.controls[select.name].setValue(Dificultades[select.value]);

  }

  chooseImage(desktopInput: HTMLInputElement){
    if(this.platform.is('android')){
      this.imagePicker.getPictures({
        maximumImagesCount: 1, 
        message:'Elije una imagen para tu receta', 
        title:'Elije una imagen para tu receta'})
      .then(async picture => {
        const nameStart = picture[0].lastIndexOf('/') + 1;
        const path = picture[0].substring(0, nameStart);
        const fileName = picture[0].substring(nameStart);
        const file = await this.androidFile.readAsDataURL(path, fileName);
        this.Recipe.ImgURL = file;
        console.log(file);
      });
    } else {
      desktopInput.click();
    }
  }

  updateDesktopImage(ev: any){
    const file = ev.target.files[0];
    if(file.type != "image/png" && file.type != "image/jpg" && file.type != "image/jpeg"){
      this.authService.showAlertDialog("Error al cargar imagen.", "Seleccione una imagen png, jpg o jpeg.");
    } else {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = (e) => {
        this.Recipe.ImgURL = fileReader.result as string;
        this.imgFile = file;
      };
    }
  }
}
