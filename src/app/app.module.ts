import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AuthComponent } from './auth/auth.component';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';
import { SpinnerService } from './_common/services/spinner.service';
import { PendingInterceptor } from './_common/interceptor/pending-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    ContactsComponent,
    AuthComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    CookieService,
    AuthService,
    SpinnerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PendingInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
