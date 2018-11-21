import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../_common/services/user.service';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) { }

    login(username: string, password: string) {
        return this.http.post('/auth/local', { username, password});
    }

    isAuthorized() {
        return this.userService.model;
    }
}
