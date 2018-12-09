import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../_common/services/user.service';
import { environment as e }  from '../../environments/environment';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) { }

    login(username: string, password: string) {
        return this.http.post(e.baseUrl + 'auth/local', { username, password});
    }

    isAuthorized() {
        return this.userService.model;
    }
}
