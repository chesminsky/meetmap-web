import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'socket.io';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from '../notifications/notifications.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public form: FormGroup;
  public messages: Array<{sender: string; text: string; }> = [];
  public userName: string;

  private socket: Socket;
  private room: string;

  @ViewChild('message')
  private messageElement: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cookies: CookieService,
    private notifications: NotificationsService
  ) { }

  ngOnInit() {

    this.userName = this.cookies.get('auth');

    this.form = this.fb.group({
      message: ''
    });

    this.socket = this.route.snapshot.data.socket;


    this.room = this.socket.id;

    this.socket.on('new_message', (data) => {

      console.log('new message', data);

      this.messages.push({
        sender: data.name,
        text: data.message
      });
    });

    this.notifications.initialize(this.socket);
  }

  public onSubmit() {

    const text = this.form.get('message').value;

    if (text) {
      this.socket.emit('new_message', { message: text, room: this.room });
      this.form.reset();
    }
  }

  public isChatActive() {
    return document.activeElement === this.messageElement.nativeElement;
  }
}
