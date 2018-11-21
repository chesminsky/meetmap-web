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

    const obj: AppNotification = this.list[index];
    const room = obj.room;
    this.list.splice(index, 1);

    this.notifications.put(Object.assign(obj, {accepted: true})).toPromise().then(() => {
      this.router.navigate(['map', room]);
    });
  }

  public deny(index: number) {
    const obj: AppNotification = this.list[index];
    this.notifications.put(Object.assign(obj, {accepted: false})).toPromise().then(() => {
      this.list.splice(index, 1);
    });
  }

}
