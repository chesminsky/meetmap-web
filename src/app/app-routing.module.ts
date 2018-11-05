import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { SocketConnectResolver } from './socket-connect.resolver';
import { NotificationsComponent } from './notifications/notifications.component';


const routes: Routes = [{
  path: '',
  redirectTo: '/map',
  pathMatch: 'full'
}, {
  path: 'auth',
  component: AuthComponent
}, {
  path: '',
  canActivate: [AuthGuard],
  resolve: {
    socket: SocketConnectResolver
  },
  children: [
    {
      path: 'map',
      component: MapComponent
    }, {
      path: 'contacts',
      component: ContactsComponent
    }, {
      path: 'notifications',
      component: NotificationsComponent
    }
  ]
}, {
  path: '**',
  redirectTo: ''
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    SocketConnectResolver
  ]
})
export class AppRoutingModule { }
