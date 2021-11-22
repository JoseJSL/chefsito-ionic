import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesPage } from './favorites';

const routes: Routes = [
  {
    path: '',
    component: FavoritesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoritesPageRoutingModule {}
