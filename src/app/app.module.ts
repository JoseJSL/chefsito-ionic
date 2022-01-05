import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, PERSISTENCE, USE_DEVICE_LANGUAGE } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideMenuComponent } from './core/side-menu/side-menu.component';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { CoreModule } from './core/core.module';


@NgModule({
  declarations: [AppComponent, SideMenuComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage()),
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [
    {provide: GooglePlus},
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: PERSISTENCE, useValue: 'local'},
    {provide: USE_DEVICE_LANGUAGE, useValue: 'true'},
    {provide: TextToSpeech}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
