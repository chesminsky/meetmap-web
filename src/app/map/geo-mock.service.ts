export class GeoMockService {

    private timer;

    constructor() { }

    public watchPosition(success: PositionCallback, opts: PositionOptions): void {

        const pos = {
            lat: 59.921830,
            lng: 30.352232,
        };

        const getRandom = (n: number) => {
            return n + Math.random() * 0.0015;
        }

        this.timer = setInterval(() => {
            success({
                coords: {
                    latitude: getRandom(pos.lat),
                    longitude: getRandom(pos.lng),
                    accuracy: 0,
                    altitude: 0,
                    altitudeAccuracy: 0,
                    heading: 0,
                    speed: 0
                },
                timestamp: Date.now()
            });
        }, opts.timeout);

    }

    public stopWatching(): void {
        clearInterval(this.timer);
    }


}
