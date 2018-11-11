import { Injectable } from '@angular/core';
import { Socket } from 'socket.io';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NotificationsService {

    public list: Array<AppNotification> = [];

    private initialized = false;

    constructor(
        private http: HttpClient
    ) { }

    public load() {
        return this.http.get<Array<AppNotification>>('/api/notifications');
    }

    initialize(socket: Socket) {

        if (!this.initialized) {
            socket.on('invitation', (data) => {

                this.list.push({
                    from: data.name,
                    room: data.socketId
                });
            });
        }

    }
}
