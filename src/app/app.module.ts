import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
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
  MatProgressSpinnerModule,
  MatSnackBarModule
} from '@angular/material';

import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AuthComponent } from './auth/auth.component';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';
import { SpinnerService } from './_common/services/spinner.service';
import { PendingInterceptor } from './_common/interceptor/pending-interceptor.service';
import { NotificationsService } from './_common/services/notification.service';
import { ErrorsHandler } from './_common/interceptor/error-interceptor.service';

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
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    CookieService,
    AuthService,
    SpinnerService,
    NotificationsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PendingInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
