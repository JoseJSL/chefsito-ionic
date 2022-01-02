import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import SwiperCore, { SwiperOptions, Navigation, Pagination } from 'swiper';
import { RecipeData } from '../recipe';
import Speech from 'speak-tts';
import { Platform } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-recipe-instructions',
  templateUrl: './recipe-instructions.component.html',
  styleUrls: ['./recipe-instructions.component.scss'],
})

export class RecipeInstructionsComponent implements OnInit {
  public webSpeech: Speech;
  public Steps: string[];
  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    navigation: true,
    pagination: {clickable: true, renderBullet: function(index, className){
      return `<span class='${className}'>${index+1}</span>`
    }},
  }

  constructor(private androidSpeech: TextToSpeech, private platform: Platform, private route: ActivatedRoute, private afs: AngularFirestore) {
    this.Steps = [
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
    ]
  }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.afs.collection('Recipe').doc(params.uid).collection<RecipeData>('Data').doc('values').valueChanges().subscribe(recipeData => {
    //     this.Steps = recipeData.Steps;
    //   });
    // });

    if(this.platform.is('android')){
      this.androidSpeech.speak({locale: 'es-AR', text: this.Steps[0]});
    } else {
      this.webSpeech = new Speech();
      this.webSpeech.init({
        volume: 1,
        lang: 'es-AR',
        rate: 1,
        pitch: 1,
        splitSentences: true,
      }).then(() => this.webSpeech.speak({text: this.Steps[0]}));
    }
  }

  readStep(stepSwiper: SwiperComponent){
    const n = stepSwiper.swiperRef.realIndex;

    if(this.platform.is('android')){
      this.androidSpeech.stop();      
      this.androidSpeech.speak({locale: 'es-AR', text: this.Steps[n]});
    } else {
      this.webSpeech.cancel();
      this.webSpeech.speak({text: this.Steps[n]});
    }
  }
}
