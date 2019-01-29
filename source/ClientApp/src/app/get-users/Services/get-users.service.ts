import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Address } from 'src/app/shared/models/address.model';

@Injectable()
export class GetUsersService {
    constructor(
        private auth: AuthService,
        ) {
    }

    getUsers(): Observable<User[]> {
        return this.auth.authGet('users');
    }

    getUser(id: string): Observable<User> {
        return this.auth.authGet('users/' + id);
    }

    registerUser(user: User) {
        this.auth.authPost('users', user).subscribe((results) => {
            console.log(results);
        });
    }
}
