import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private cookies: CookieService
    ) { }

    login(username: string, password: string) {
        return this.http.post('/auth', { username, password});
    }

    isAuthorized() {
        return this.cookies.get('auth');
    }
}
