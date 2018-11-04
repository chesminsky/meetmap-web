import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule } from '@angular/material';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MapComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
