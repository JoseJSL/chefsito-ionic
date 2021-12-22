import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './register-user/register-user.component';
import { IonicModule } from '@ionic/angular';
import { WelcomeComponent } from './welcome/welcome.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [RegisterUserComponent],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule
  ]
})
export class CoreModule { }
