import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient
    ) { }

    login(username: string, password: string) {
        return this.http.post('/auth', { username, password});
    }
}
