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

    public async initialize(socket: Socket) {

        if (!this.initialized) {
            socket.on('invitation', (obj: AppNotification) => {

                this.list.push(obj);
            });

            return this.getAll().toPromise().then((arr) => this.list = arr);
        }

    }

    public getAll() {
        return this.http.get<Array<AppNotification>>('/api/notifications');
    }

    public create(obj: AppNotification) {
        return this.http.post<Array<AppNotification>>('/api/notifications', obj);
    }

    public put(obj: AppNotification) {
        return this.http.post<Array<AppNotification>>(`/api/notifications/${obj._id}`, obj);
    }
}
