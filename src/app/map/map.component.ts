import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'socket.io';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cookies: CookieService
  ) { }

  ngOnInit() {

    this.userName = this.cookies.get('auth');

    this.form = this.fb.group({
      message: ''
    });

    this.socket = this.route.snapshot.data.socket;

    this.socket.emit('change_username', { username: this.userName });

    this.socket.on('connect', () => {
      // socket connected
      this.room = this.socket.id;
      console.log('connected to room ', this.room);
    });

    this.socket.on('new_message', (data) => {

      console.log(data);

      this.messages.push({
        sender: data.name,
        text: data.message
      });
    });
  }

  public onSubmit() {

    this.socket.emit('new_message', { message: this.form.get('message').value, room: this.room });

    this.form.reset();
  }
}
