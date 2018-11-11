import { Component, OnInit } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  public listToFriends: Array<AppNotification>;
  public listToMap: Array<AppNotification>;

  constructor(
    private notifications: NotificationsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listToFriends = this.notifications.list.filter((n) => n.type === 'friend');
    this.listToMap = this.notifications.list.filter((n) => n.type === 'map');
  }

  public acceptMap(index: number) {

    const room = this.listToMap[index].room;
    this.listToMap.splice(index, 1);

    this.router.navigate(['map'], {
      queryParams: {
        room
      }
    });
  }

  public denyMap(index: number) {
    this.listToMap.splice(index, 1);
  }

  public acceptFriend(index: number) {
    this.listToFriends.splice(index, 1);
  }

  public denyFriend(index: number) {
    this.listToFriends.splice(index, 1);
  }

}
