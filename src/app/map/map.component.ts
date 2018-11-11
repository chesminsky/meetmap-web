import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'socket.io';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationsService } from '../notifications/notifications.service';
import { UserService } from '../_common/services/user.service';

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
    private userService: UserService
  ) { }

  ngOnInit() {

    this.userName = this.userService.model.name;

    this.form = this.fb.group({
      message: ''
    });

    this.socket = this.route.snapshot.data.socket;


    this.room =  this.route.snapshot.queryParamMap.get('room') || this.socket.id;

    this.socket.emit('change_room', { socketId: this.room });

    this.socket.on('new_message', (data) => {

      console.log('new message', data);

      this.messages.push({
        sender: data.name,
        text: data.message
      });
    });
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
