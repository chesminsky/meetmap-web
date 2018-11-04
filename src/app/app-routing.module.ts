import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { ContactsComponent } from './contacts/contacts.component';


const routes: Routes = [{
  path: '',
  redirectTo: '/map',
  pathMatch: 'full'
}, {
  path: 'map',
  component: MapComponent
}, {
  path: 'contacts',
  component: ContactsComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
