import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router,
        private cookies: CookieService
    ) { }

    canActivate(): boolean {

        const userName = this.cookies.get('auth');

        if (!userName) {
            this.router.navigate(['auth']);
            return false;
        }
        return true;
    }
}
