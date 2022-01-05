import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { ExplorePage } from './explore/explore.page';
import { FavoritesPage } from './favorites/favorites.page';
import { HomePage } from './home/home.page';
import { ProfileComponent } from './profile/profile.component';
import { RecipeInstructionsComponent } from './recipe-page/recipe-instructions/recipe-instructions.component';
import { RecipePage } from './recipe-page/recipe-page.component';
import { TabsPage } from './tabs.page';

const redirectInToLogin = () => redirectUnauthorizedTo(['welcome']);

const routes: Routes = [
    {
    path: 'app/create-recipe',
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectInToLogin},
    component: CreateRecipeComponent,
  },
  {
    path: 'app/profile',
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectInToLogin},
    component: ProfileComponent,
  },
  {
    path: 'app/recipe',
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectInToLogin},
    children: [
      {
        path: ':uid',
        component: RecipePage,
      },
      {
        path: ':uid/steps',
        component: RecipeInstructionsComponent,
      }
    ]
  },
  {
    path: 'app',
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectInToLogin},
    component: TabsPage,
    children: [
      {
        path: 'home',
        component: HomePage,
      },
      {
        path: 'explore',
        component: ExplorePage,
      },
      {
        path: 'favorites',
        component: FavoritesPage,
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
