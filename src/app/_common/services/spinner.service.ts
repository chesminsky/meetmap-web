
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class SpinnerService {

    public visibiliy$: ReplaySubject<boolean>;
    private pendingRequests = 0;

    constructor() {
        this.visibiliy$ = new ReplaySubject();
    }

    check() {

        // временно сделано обращение в DOM напрямую
        // TODO разобраться с change detection и сделать нормально
        const sninnerLayer = document.querySelector('.app-layer');

        const visibility = this.pendingRequests > 0;

        if (visibility && sninnerLayer) {
            sninnerLayer.classList.add('is-visible');
        } else {
            sninnerLayer.classList.remove('is-visible');
        }
    }

    inc() {
        this.pendingRequests++;
        this.check();
    }

    dec() {
        this.pendingRequests--;
        this.check();
    }


}
