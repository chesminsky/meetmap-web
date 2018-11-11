import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

    public model

    constructor(
        private http: HttpClient
    ) { }

    get() {
        return this.http.get('/api/user');
    }


}
