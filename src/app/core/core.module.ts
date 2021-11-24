import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './register-user/register-user.component';
import { IonicModule } from '@ionic/angular';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [RegisterUserComponent, WelcomeComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class CoreModule { }
