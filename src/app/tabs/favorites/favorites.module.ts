import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesPage } from './favorites.page';

import { FavoritesPageRoutingModule } from './favorites-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FavoritesPage }]),
    FavoritesPageRoutingModule,
  ],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}
