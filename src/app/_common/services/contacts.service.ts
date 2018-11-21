import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class ContactsService {

    constructor(
        private http: HttpClient
    ) { }

    get(id: string) {
        return this.http.get<User>('/api/users/' + id);
    }

    getAll() {
        return this.http.get<Array<User>>('/api/users');
    }


}
