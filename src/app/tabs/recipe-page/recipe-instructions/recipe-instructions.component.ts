import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import SwiperCore, { SwiperOptions, Navigation, Pagination } from 'swiper';
import { RecipeData } from '../../../recipe';
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
  private justLoaded = true;
  public webSpeech: Speech;
  public Steps: string[];
  public swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    navigation: true,
    pagination: {clickable: true, renderBullet: function(index, className){
      return `<span class='${className}'>${index+1}</span>`
    }},
  }

  constructor(private androidSpeech: TextToSpeech, private platform: Platform, private activeRoute: ActivatedRoute, private router: Router,private afs: AngularFirestore) {}

  async ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.afs.collection('Recipe').doc(params.uid).collection<RecipeData>('Data').doc('Values').valueChanges().subscribe(recipeData => {
        if(recipeData){
          this.Steps = recipeData.Steps;

          if(this.platform.is('android')){
            this.androidSpeech.speak({locale: 'es-AR', text: this.Steps[0]});
          } else {
            this.webSpeech = new Speech();
            this.webSpeech.init({
              volume: 1,
              lang: 'es-AR',
              voice: 'Microsoft Elena Online (Natural) - Spanish (Argentina)',
              rate: 1,
              pitch: 1,
              splitSentences: true,
            }).then(() => {
              if(this.justLoaded) {
                if(this.justLoaded) {
                  this.webSpeech.cancel();
                  this.webSpeech.speak({text: this.Steps[0]});
                }
                this.justLoaded = false;
              }
            });
          }
        } else {
          this.router.navigate(['/app', 'home']);
        }
      });
    });
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
