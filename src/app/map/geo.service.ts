export class GeoService {

    private watchId: number;

    private mock = [
        {
            lat: 59.921830,
            lng: 30.352232,
        },
        {
            lat: 59.921580,
            lng: 30.352785,
        },
        {
            lat: 59.921263,
            lng: 30.353600,
        },
        {
            lat: 59.920838,
            lng: 30.352613,
        },
        {
            lat: 59.920569,
            lng: 30.351937,
        },
        {
            lat: 59.919977,
            lng: 30.350381,
        },
        {
            lat: 59.920466,
            lng: 30.348954,
        },
        {
            lat: 59.921047,
            lng: 30.350317,
        },
        {
            lat: 59.921493,
            lng: 30.351379,
        },
    ];

    private isMock: boolean;
    private timer;

    private iterator;

    constructor() { }

    public watchPosition(success: PositionCallback, opts: PositionOptions): void {

        const error = () => {
            if (location.protocol !== 'https') {
                this.isMock = true;
                const it = this.makeIterator(this.mock);

                this.timer = setInterval(() => {
                    success({
                        coords: {
                            latitude: it.next().lat,
                            longitude: it.next().lng,
                            accuracy: 0,
                            altitude: 0,
                            altitudeAccuracy: 0,
                            heading: 0,
                            speed: 0
                        },
                        timestamp: Date.now()
                    })
                }, opts.timeout);
            } else {
                console.error('Error: No GPS data.');
            }
        };
        this.watchId = navigator.geolocation.watchPosition(success, error, opts);
    }

    public stopWatching(): void {
        if (this.isMock) {
            clearInterval(this.timer);
        } else {
            navigator.geolocation.clearWatch(this.watchId);
        }
    }

    private makeIterator(array) {
        let nextIndex = 0;

        return {
            next: function () {
                if (nextIndex >= array.length) {
                    nextIndex = 0;
                }

                return array[nextIndex++];
            },
        };
    }

}
