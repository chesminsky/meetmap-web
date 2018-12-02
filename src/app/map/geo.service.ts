export class GeoService {

    private watchId: number;

    constructor() { }

    public watchPosition(success: PositionCallback, opts: PositionOptions): void {

        const error = () => {
            console.error('Error: No GPS data.');
        };

        this.watchId = navigator.geolocation.watchPosition(success, error, opts);
    }

    public stopWatching(): void {
        navigator.geolocation.clearWatch(this.watchId);
    }
}
