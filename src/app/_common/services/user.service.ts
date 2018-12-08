import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as e }  from '../../../environments/environment'

@Injectable()
export class UserService {

    public model

    constructor(
        private http: HttpClient
    ) { }

    get() {
        return this.http.get(e.baseUrl + 'api/user');
    }

    logout() {
        return this.http.get(e.baseUrl + 'auth/logout');
    }


}
