export class MapUtils {

    public compassHeading = 0;
    private initialized = false;

    constructor() { }

    init() {

        if (this.initialized) {
            return;
        }

        //this.listenCompassHeading();
        this.initialized = true;
    }

    public radians(n) {
        return n * (Math.PI / 180);
    }

    public degrees(n) {
        return n * (180 / Math.PI);
    }

    public getBearing(startLat, startLong, endLat, endLong) {
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

    public getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
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

    public deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    private listenCompassHeading() {
        const FULLTILT = (<any>window).FULLTILT;

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
