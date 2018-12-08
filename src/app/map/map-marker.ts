export function CustomMarkerFn() {
    const googleMaps = window.cordova ? window.plugin.google.maps : window.google.maps;

    return class CustomMarker extends googleMaps.OverlayView {

        private latlng;
        private args;
        private div: HTMLElement;
        private liter: string;

        constructor(latlng, map, args, liter: string) {
            super();
            this.latlng = latlng;
            this.args = args;
            this.liter = liter;
            this.setMap(map);
        }

        draw() {

            let div = this.div;

            if (!div) {

                div = this.div = document.createElement('div');
                div.className = 'marker';
                div.innerHTML = this.liter;

                if (typeof (this.args.marker_id) !== 'undefined') {
                    div.dataset.marker_id = this.args.marker_id;
                }

                googleMaps.event.addDomListener(div, 'click', (event) => {
                    googleMaps.event.trigger(this, 'click');
                });

                const panes = this.getPanes();
                panes.overlayImage.appendChild(div);
            }

            const point = this.getProjection().fromLatLngToDivPixel(this.latlng);

            if (point) {
                div.style.left = point.x + 'px';
                div.style.top = point.y + 'px';
            }
        }

        remove() {
            if (this.div) {
                this.div.parentNode.removeChild(this.div);
                this.div = null;
            }
        }

        getPosition() {
            return this.latlng;
        }
    }
}


