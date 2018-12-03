import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../_common/services/notifications.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public needBackButton: boolean;

  constructor(
    private auth: AuthService,
    private notifications: NotificationsService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
        this.needBackButton = this.location.path().includes('/map');
    });
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

}
