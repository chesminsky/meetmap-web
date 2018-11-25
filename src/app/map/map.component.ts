import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'socket.io';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationsService } from '../_common/services/notifications.service';
import { UserService } from '../_common/services/user.service';
import { } from 'googlemaps';

interface GpsEvent {
  name: string;
  pos: {
    lon: number;
    lat: number;
  }
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public messages: Array<{ sender: string; text: string; }> = [];
  public userName: string;
  public room: string;
  private watchId: number;

  private socket: Socket;
  private map: google.maps.Map;
  private markers: { [key: string]: google.maps.Marker } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

    this.socket.on('gps', (data: GpsEvent) => {

      if (this.markers[data.name]) {
        this.markers[data.name].setMap(null);
      }

      this.markers[data.name] = new window.google.maps.Marker({
        position: data.pos,
        map: this.map
      });
    });

    setTimeout(() => {
      this.initMap();
    });
  }

  ngOnDestroy() {
    this.stopWatching();
  }

  public goToChat() {
    this.router.navigate(['chat', this.room]);
  }

  private initMap() {

    this.map = new window.google.maps.Map(this.mapRef.nativeElement, {
      zoom: 17
    });

    this.listenGeolocation();

  }

  private watchPosition(success: PositionCallback, error: PositionErrorCallback, opts: PositionOptions): void {
    this.watchId = navigator.geolocation.watchPosition(success, error, opts);
  }

  private stopWatching(): void {
    navigator.geolocation.clearWatch(this.watchId);
  }

  private listenGeolocation(): void {
    const success = (position: Position) => {

      const { latitude, longitude, speed } = position.coords;

      const pos = {
        lat: latitude,
        lng: longitude
      };

      this.socket.emit('gps', {
        pos,
        room: this.room
      });

      this.map.setCenter(pos);
    };

    const error = () => {
      console.error('Error: No GPS data.');
    };

    this.watchPosition(success, error, {
      timeout: 3000,
      enableHighAccuracy: true
    });
  }
}
