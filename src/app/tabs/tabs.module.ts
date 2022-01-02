import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { HomePageModule } from './home/home.module';
import { ExplorePageModule } from './explore/explore.module';
import { FavoritesPageModule } from './favorites/favorites.module';
import { RecipePage } from './recipe-page/recipe-page.component';
import { SwiperModule } from 'swiper/angular';
import { ProfilePopoverComponent } from './profile-popover/profile-popover.component';
import { RecipeInstructionsComponent } from './recipe-page/recipe-instructions/recipe-instructions.component';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    ExplorePageModule,
    FavoritesPageModule,
    SwiperModule,
  ],
  declarations: [TabsPage, SearchBarComponent, RecipePage, RecipeInstructionsComponent, ProfilePopoverComponent],
  exports: [RecipePage, SearchBarComponent],
  providers: [
    {provide: TextToSpeech}
  ]
})
export class TabsPageModule {}
