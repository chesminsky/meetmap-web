import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsersService {

    constructor(
        private http: HttpClient
    ) { }

    get(name: string) {
        return this.http.get('/api/users/' + name);
    }

    getAll() {
        return this.http.get('/api/users');
    }


}
