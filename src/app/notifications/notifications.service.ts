import { Injectable } from '@angular/core';
import { Socket } from 'socket.io';

@Injectable()
export class NotificationsService {

    public list: Array<{ from: string; room: string; }> = [];

    private initialized = false;

    constructor() { }

    initialize(socket: Socket) {

        if (!this.initialized) {
            socket.on('invitation', (data) => {

                this.list.push({
                    from: data.name,
                    room: data.socketId
                });
               // alert('invitation from ' + data.name + ' room changed from ' + room + ' to ' + data.socketId);

                // $('#friend').html(data.name);

                // roomToChange = data.socketId;

                // modal.open();
            });
        }

    }
}
