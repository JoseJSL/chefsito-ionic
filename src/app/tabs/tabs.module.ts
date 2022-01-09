import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { RecipePage } from './recipe-page/recipe-page.component';
import { SwiperModule } from 'swiper/angular';
import { RecipeInstructionsComponent } from './recipe-page/recipe-instructions/recipe-instructions.component';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { RouterModule } from '@angular/router';
import { RecipeGrid } from './recipe-grid/recipe-grid.component';
import { ExplorePage } from './explore/explore.page';
import { ExploreCardComponent } from './explore/explore-card-grid/explore-card.component';
import { FavoritesPage } from './favorites/favorites.page';
import { HomePage } from './home/home.page';
import { ProfileComponent } from './profile/profile.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { IonicRatingModule } from 'ionic-rating';
import { ChefsitoComponent } from './chefsito/chefsito.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsPageRoutingModule,
    SwiperModule,
    RouterModule,
    IonicRatingModule
  ],
  declarations: [
    TabsPage,
    SearchBarComponent,
    RecipeGrid,
    RecipeCardComponent,
    RecipePage,
    RecipeInstructionsComponent,
    HomePage,
    ExplorePage,
    ExploreCardComponent,
    FavoritesPage,
    ProfileComponent,
    CreateRecipeComponent,
    ChefsitoComponent
  ],
  exports: [RecipePage, SearchBarComponent],
  providers: [
    {provide: TextToSpeech},
  ]
})
export class TabsPageModule {}
