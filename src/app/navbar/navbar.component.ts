import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../_common/services/notifications.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../_common/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public showBackButton: boolean;
  public showMenuButton: boolean;
  public menuVisible: boolean;

  constructor(
    private auth: AuthService,
    private notifications: NotificationsService,
    private router: Router,
    private location: Location,
    private user: UserService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
        const p = this.location.path();
        this.showBackButton = !p.includes('/map') && !p.includes('/auth');
        this.showMenuButton = p.includes('/map');
    });

  }

  get userName() {
    return this.user.model.name;
  }

  get isAuthorized() {
    return this.auth.isAuthorized();
  }

  get notificationsLength() {
    return this.notifications.list.length;
  }

  back() {
    this.location.back();
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  logout() {
    this.user.logout().toPromise().then(() => this.router.navigate(['auth']));
  }

}
