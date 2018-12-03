import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';


@Injectable()
export class ContactsService {

    constructor(
        private http: HttpClient,
        private user: UserService
    ) { }

    get(id: string) {
        return this.http.get<User>('/api/users/' + id);
    }

    getAll() {
        return this.http.get<Array<User>>('/api/users').pipe(
            map((results: Array<User>) => {
                return results.filter((user: User) => user._id !== this.user.model._id)
            })
        );
    }


}
