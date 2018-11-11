import { Socket } from 'socket.io';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications/notifications.service';
import { UserService } from './_common/services/user.service';

@Injectable()
export class SocketConnectResolver implements Resolve<Socket> {

  constructor(
    private notifications: NotificationsService,
    private userService: UserService
  ) {}

  async resolve() {

    const { io } = window;

    const userName = this.userService.model.name;
    const socket: Socket = io.connect('/');
    socket.emit('change_username', { username: userName });

    const promiseConnect = () => new Promise((resolve) => socket.on('connect', () => {
      console.log('socket connected');
      resolve();
    }));

    await promiseConnect();

    this.notifications.initialize(socket);

    return socket;
  }
}
