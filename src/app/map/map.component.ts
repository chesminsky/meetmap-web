import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'socket.io';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationsService } from '../_common/services/notifications.service';
import { UserService } from '../_common/services/user.service';
import { } from 'googlemaps';
import { GeoService } from './geo.service';

const FULLTILT = (<any>window).FULLTILT;

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
  public compassHeading = 0;

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

    this.listenCompassHeading();
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

  public getLiteral(name: string) {
    return name.toUpperCase().substr(0, 1);
  }

  public getFrends() {
    return Object.keys(this.markers).filter((n) => n !== this.userName);
  }

  public getDistance(name) {
    return this.getDistanceFromLatLon(
      this.markers[this.userName].getPosition().lat(),
      this.markers[this.userName].getPosition().lng(),
      this.markers[name].getPosition().lat(),
      this.markers[name].getPosition().lng()
    );
  }

  public getMarkerRotation(name) {
    const deg = this.getBearing(
      this.markers[this.userName].getPosition().lat(),
      this.markers[this.userName].getPosition().lng(),
      this.markers[name].getPosition().lat(),
      this.markers[name].getPosition().lng()
    );
    return deg;
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

    let dLong = endLong - startLong;

    const dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI) {
      if (dLong > 0.0) {
        dLong = -(2.0 * Math.PI - dLong);
      } else {
        dLong = (2.0 * Math.PI + dLong);
      }
    }

    return (this.degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  }

  private getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(1000 * d);
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  private listenCompassHeading() {
    const promise = FULLTILT.getDeviceOrientation({ 'type': 'world' });

    // Wait for Promise result
    promise.then((deviceOrientation) => { // Device Orientation Events are supported

      // Register a callback to run every time a new
      // deviceorientation event is fired by the browser.
      deviceOrientation.listen(() => {

        // Get the current *screen-adjusted* device orientation angles
        const currentOrientation = deviceOrientation.getScreenAdjustedEuler();

        // Calculate the current compass heading that the user is 'looking at' (in degrees)
        const compassHeading = 360 - currentOrientation.alpha;

        // Do something with `compassHeading` here...

        this.compassHeading = compassHeading;

      });

    }).catch((errorMessage) => { // Device Orientation Events are not supported

      console.log(errorMessage);

      // Implement some fallback controls here...

    });
  }
}
