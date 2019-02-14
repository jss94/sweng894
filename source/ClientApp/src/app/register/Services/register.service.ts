import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { Vendor } from 'src/app/shared/models/vendor.model';

@Injectable()
export class RegisterService {
    constructor(
        private auth: AuthService,
        ) {
    }

    getUsers(): Observable<User[]> {
        return this.auth.get('users');
    }

    getUser(id: string): Observable<User> {
        return this.auth.get('users/' + id);
    }

    registerUser(user: User, password: string): Observable<[User, any]> {
        // return this.auth.post('users', user);
        return forkJoin(
            this.auth.post('users', user),
            this.auth.auth0Signup(user, password)
        );
    }

    registerVendor(vendor: Vendor): Observable<Vendor> {
        return this.auth.post('vendors', vendor);
    }
}
