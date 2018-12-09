import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'socket.io';
import { UserService } from '../_common/services/user.service';
import { } from 'googlemaps';
import { GeoService } from './geo.service';
import { MapUtils } from './map-utils.service';
// import { CustomMarkerFn } from './map-marker';


interface GpsEvent {
  name: string;
  pos: {
    lng: number;
    lat: number;
  };
}

const googleMaps = () => window.cordova ? window.plugin.google.maps : window.google.maps;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit, OnDestroy {


  public userName: string;
  public room: string;

  private socket: Socket;
  private map;
  private markers = {};
  private mapRadius = 135;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private geo: GeoService,
    private utils: MapUtils,
  ) { }

  @ViewChild('map')
  private mapRef: ElementRef<Element>;

  ngOnInit() {

    console.log('map component init');

    this.socket = this.route.snapshot.data.socket;
    const room = this.route.snapshot.paramMap.get('room');

    if (!room) {
      this.router.navigate([this.userService.model._id], {
        relativeTo: this.route
      });

      return;
    }

    this.room = room;
    this.userName = this.userService.model.name;
    this.socket.emit('change_room', { room });

    this.socket.on('gps', (data: GpsEvent) => {

      console.log('new gps event', data);

      if (!data.name) {
        return;
      }

      if (!this.markers[data.name]) {
        this.markers[data.name] = this.map.addMarker({
          position: data.pos,
          visible: this.isOnMap(data.name)
        });
      } else {
        this.markers[data.name].setPosition(data.pos);
      }

      this.markers[data.name].setVisible(this.isOnMap(data.name));
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

  public isOnMap(name: string): boolean {
    return (name !== this.userName) && (this.getDistance(name) < this.mapRadius);
  }

  private initMap() {
    const G = googleMaps();
    G.environment.setBackgroundColor('#e7eff6');

    this.map = G.Map.getMap(this.mapRef.nativeElement, {
      zoom: 17
    });

    console.log('map initialized');

    this.listenGeolocation();
  }

  private listenGeolocation(): void {
    const success = (position: Position) => {

      const { latitude, longitude, speed } = position.coords;

      const pos = {
        lat: latitude,
        lng: longitude
      };

      console.log('new location', pos);

      this.socket.emit('gps', {
        pos,
        room: this.room
      });

      this.map.animateCamera({
        target: pos,
        duration: 1000,
        zoom: 17,
        bearing: -this.compassHeading
      });

      console.log('set compass heading: ', this.compassHeading);
    };

    this.geo.watchPosition(success, {
      timeout: 3000,
      enableHighAccuracy: true
    });

    console.log('start listening geolocations');
  }

  public getLiteral(name: string) {
    return name.toUpperCase().substr(0, 1);
  }

  public getFrends() {
    return Object.keys(this.markers).filter((n) => n !== this.userName);
  }

  public getDistance(name) {
    try {
      return this.utils.getDistanceFromLatLon(
        this.markers[this.userName].getPosition().lat,
        this.markers[this.userName].getPosition().lng,
        this.markers[name].getPosition().lat,
        this.markers[name].getPosition().lng
      );
    } catch (e) {
      console.error('Map error: can not calculate distance');
    }
  }

  public getMarkerRotation(name) {
    try {

      const b = this.utils.getBearing(
        this.markers[this.userName].getPosition().lat,
        this.markers[this.userName].getPosition().lng,
        this.markers[name].getPosition().lat,
        this.markers[name].getPosition().lng
      );

      return b;
    } catch (e) {
      console.error('Map error: can not calculate direction');
    }

  }

}
