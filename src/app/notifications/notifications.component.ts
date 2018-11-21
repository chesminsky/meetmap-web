import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../_common/services/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  public list: Array<AppNotification>;

  constructor(
    private notifications: NotificationsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.list = this.notifications.list;
  }

  public accept(index: number) {

    const room = this.list[index].room;
    this.list.splice(index, 1);

    this.router.navigate(['map'], {
      queryParams: {
        room
      }
    });
  }

  public deny(index: number) {
    this.list.splice(index, 1);
  }

}
