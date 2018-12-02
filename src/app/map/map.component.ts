import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'socket.io';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationsService } from '../_common/services/notifications.service';
import { UserService } from '../_common/services/user.service';
import { } from 'googlemaps';
import { GeoService } from './geo.service';
import { MapUtils } from './map-utils.service';

interface GpsEvent {
  name: string;
  pos: {
    lon: number;
    lat: number;
  };
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

  private socket: Socket;
  private map: google.maps.Map;
  private markers: { [key: string]: google.maps.Marker } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private geo: GeoService,
    private utils: MapUtils
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
        map: data.name !== this.userName ? this.map : null
      });

    });

    setTimeout(() => {
      this.initMap();
    });

    this.utils.init();
  }

  ngOnDestroy() {
    this.geo.stopWatching();
  }

  public goToChat() {
    this.router.navigate(['chat', this.room]);
  }

  public get compassHeading() {
    return this.utils.compassHeading;
  }

  private initMap() {

    this.map = new window.google.maps.Map(this.mapRef.nativeElement, {
      zoom: 17,
      disableDefaultUI: true,
      draggable: false,
    });

    this.listenGeolocation();

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

    this.geo.watchPosition(success, {
      timeout: 3000,
      enableHighAccuracy: true
    });
  }

  public getLiteral(name: string) {
    return name.toUpperCase().substr(0, 1);
  }

  public getFrends() {
    return Object.keys(this.markers).filter((n) => n !== this.userName);
  }

  public getDistance(name) {
    return this.utils.getDistanceFromLatLon(
      this.markers[this.userName].getPosition().lat(),
      this.markers[this.userName].getPosition().lng(),
      this.markers[name].getPosition().lat(),
      this.markers[name].getPosition().lng()
    );
  }

  public getMarkerRotation(name) {
    const deg = this.utils.getBearing(
      this.markers[this.userName].getPosition().lat(),
      this.markers[this.userName].getPosition().lng(),
      this.markers[name].getPosition().lat(),
      this.markers[name].getPosition().lng()
    );
    return deg;
  }

}
