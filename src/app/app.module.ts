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

import { AuthService } from './auth/auth.service';
import { SpinnerService } from './_common/services/spinner.service';
import { PendingInterceptor } from './_common/interceptor/pending-interceptor.service';
import { MessagesService } from './_common/services/messages.service';
import { ErrorsHandler } from './_common/interceptor/error-interceptor.service';
import { ContactsService } from './_common/services/contacts.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsService } from './_common/services/notifications.service';
import { UserService } from './_common/services/user.service';
import { ChatComponent } from './chat/chat.component';
import { GeoService } from './map/geo.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent,
    ContactsComponent,
    AuthComponent,
    NotificationsComponent,
    ChatComponent
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
    AuthService,
    SpinnerService,
    MessagesService,
    ContactsService,
    UserService,
    NotificationsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PendingInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler
    },
    GeoService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
