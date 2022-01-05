import { Component, OnInit, ViewChild } from '@angular/core';
import { defaultRecipe, defaultRecipeData, FavoriteRecipe, Recipe, RecipeData } from '../../recipe';
import { IonIcon, IonSegment } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})

export class RecipePage implements OnInit {
  @ViewChild('favoriteIcon') favoriteIcon: IonIcon;
  public Recipe: Recipe = defaultRecipe;
  public RecipeData: RecipeData = defaultRecipeData;
  public currentSegment: number = 0;
  public originalPortionSize: number;

  constructor(private auth: AngularFireAuth,private afs: AngularFirestore ,private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.afs.collection<Recipe>('Recipe').doc(params.uid).valueChanges().subscribe(recipe => {
        if(recipe){
          this.Recipe = recipe;
          this.Recipe.UID = params.uid;
          this.originalPortionSize = this.Recipe.PortionSize;
          this.afs.collection('Recipe').doc(params.uid).collection<RecipeData>('Data').doc('Values').valueChanges().subscribe(recipeData => {
            this.RecipeData = recipeData;
          });

          this.auth.user.subscribe(user => {
            this.afs.collection('User').doc(user.uid).collection('Favorites').doc(this.Recipe.UID).get().subscribe(favoriteRecipe => {
              if(favoriteRecipe.exists){
                this.favoriteIcon.name = 'heart';
              }
            });
          });
        } else {
          this.router.navigate(['app', 'home']);
        }
      });
    });
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
    segments.swiperRef.el.scrollTop = 0;
  }

  sliderSwiped(segments: SwiperComponent, segmentSelector: IonSegment){
    switch(segments.swiperRef.realIndex){
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

  startAssistant(){
    this.router.navigate(['/app', 'recipe', this.Recipe.UID, 'steps']);
  }

  addToFavorites(){
    this.auth.user.subscribe(user => {
      this.afs.collection('User').doc(user.uid).collection<FavoriteRecipe>('Favorites').doc(this.Recipe.UID).get().subscribe(favoriteRecipe => {
        if(favoriteRecipe.exists){
          this.favoriteIcon.name = 'heart-outline';
          favoriteRecipe.ref.delete();
        } else {
          this.favoriteIcon.name = 'heart';
          favoriteRecipe.ref.set({addedAt: new Date()});
        }
      });
    });
  }
}
