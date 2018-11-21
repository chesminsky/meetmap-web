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

        const updateList = () => {
            return this.getAll().toPromise().then((arr) => this.list = arr)
        }

        if (!this.initialized) {
            socket.on('invitation', () => {
                updateList();
            });

            return updateList();
        }

    }

    public getAll() {
        return this.http.get<Array<AppNotification>>('/api/notifications');
    }

    public create(obj: AppNotification) {
        return this.http.post<Array<AppNotification>>('/api/notifications', obj);
    }

    public put(obj: AppNotification) {
        return this.http.put<Array<AppNotification>>(`/api/notifications/${obj._id}`, obj);
    }
}
