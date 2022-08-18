import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { HeaderComponent } from './header/header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptor} from "./interceptors/auth-interceptor";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {InscriptionComponent} from "./inscription/inscription.component";
import {ListComponent} from "./posts/list/list.component";
import {PostComponent} from "./post-action/post.component";
import {OneComponent} from "./posts/one/one.component";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import {ConsentComponent} from "./dialog/consent.component";
@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    ListComponent,
    OneComponent,
    HeaderComponent,
    InscriptionComponent,
    PostComponent,
    ConsentComponent

  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NoopAnimationsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
