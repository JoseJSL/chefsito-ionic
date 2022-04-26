import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectLoggedInTo } from '@angular/fire/compat/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './core/privacy-policy/privacy-policy.component';
import { WelcomeComponent } from './core/welcome/welcome.component';

const redirectLoggedInToHome = () => redirectLoggedInTo(['app', 'home']);

const routes: Routes = [
  {path: 'welcome', component: WelcomeComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectLoggedInToHome}},
  {path: 'privacy-policy', component: PrivacyPolicyComponent },
  {path: '', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
