import { Socket } from 'socket.io';
import { CookieService } from 'ngx-cookie-service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class SocketConnectResolver implements Resolve<Socket> {

  constructor(
    private cookies: CookieService
  ) {}

  async resolve() {

    const { io } = window;

    const userName = this.cookies.get('auth');
    const socket: Socket = io.connect('/');
    socket.emit('change_username', { username: userName });

    const promiseConnect = () => new Promise((resolve) => socket.on('connect', () => {
      console.log('socket connected');
      resolve();
    }));

    await promiseConnect();

    return socket;
  }
}
