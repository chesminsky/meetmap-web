import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'socket.io';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationsService } from '../_common/services/notifications.service';
import { UserService } from '../_common/services/user.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public form: FormGroup;
  public messages: Array<{ sender: string; text: string; }> = [];
  public userName: string;
  public room: string;

  private socket: Socket;

  @ViewChild('message')
  private messageElement: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  @ViewChild('map')
  private mapRef: ElementRef<Element>;

  ngOnInit() {

    this.socket = this.route.snapshot.data.socket;
    const room = this.route.snapshot.paramMap.get('room');

    if (!room) {
      this.router.navigate([this.socket.id], {
        relativeTo: this.route
      });

      return;
    }

    this.room = room;
    this.userName = this.userService.model.name;
    this.socket.emit('change_room', { room });

    this.form = this.fb.group({
      message: ''
    });

    this.socket.on('new_message', (data) => {
      this.messages.push({
        sender: data.name,
        text: data.message
      });
    });

    setTimeout(() => {
      this.initMap();
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
    if (!this.messageElement) {
      return false;
    }
    return document.activeElement === this.messageElement.nativeElement;
  }

  private initMap() {


    new window.google.maps.Map(this.mapRef.nativeElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });

  }
}
