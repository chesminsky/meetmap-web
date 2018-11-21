import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { UserService } from '../_common/services/user.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    async canActivate(): Promise<boolean> {

        try {
            const user = await this.userService.get().toPromise();
            if (!user) {
                this.router.navigate(['auth']);
                return false;
            }

            this.userService.model = user;
        } catch (e) {
            this.router.navigate(['auth']);
            return false;
        }

        return true;
    }
}
