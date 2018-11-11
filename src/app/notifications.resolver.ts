import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications/notifications.service';

@Injectable()
export class NotificationsResolver implements Resolve<Array<AppNotification>> {

  constructor(
    private notificationsService: NotificationsService
  ) {}

  async resolve() {

    const list = await this.notificationsService.load().toPromise();

    this.notificationsService.list = list;

    return list;
  }
}
