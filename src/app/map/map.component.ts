import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'socket.io';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationsService } from '../_common/services/notifications.service';
import { UserService } from '../_common/services/user.service';
import { } from 'googlemaps';
import { GeoService } from './geo.service';

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

  private socket: Socket;
  private map: google.maps.Map;
  private markers: { [key: string]: google.maps.Marker } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private geo: GeoService
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
    this.geo.stopWatching();
  }

  public goToChat() {
    this.router.navigate(['chat', this.room]);
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

  public getFrends() {
    return Object.keys(this.markers);
  }

  public getDistance(name) {
    return this.getDistanceFromLatLon(
      this.markers[this.userName].getPosition().lat(),
      this.markers[this.userName].getPosition().lng(),
      this.markers[name].getPosition().lat(),
      this.markers[name].getPosition().lng()
    )
  }


  // -- geo utils --

  private radians(n) {
    return n * (Math.PI / 180);
  }

  private degrees(n) {
    return n * (180 / Math.PI);
  }

  private getBearing(startLat, startLong, endLat, endLong) {
    startLat = this.radians(startLat);
    startLong = this.radians(startLong);
    endLat = this.radians(endLat);
    endLong = this.radians(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI) {
      if (dLong > 0.0)
        dLong = -(2.0 * Math.PI - dLong);
      else
        dLong = (2.0 * Math.PI + dLong);
    }

    return (this.degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  }

  private getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return Math.round(1000 * d);
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
}
