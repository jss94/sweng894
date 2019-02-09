import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user.model';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Address } from 'src/app/shared/models/address.model';

@Injectable()
export class UsersService {
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

    registerUser(user: User): Observable<User> {
        return this.auth.post('users', user);
    }

    deactivateUser(user: User): Observable<boolean> {
        return this.auth.put('users/deactivate/' + user.userName, {});
    }

    reactivateUser(userName: string): Observable<boolean> {
        return this.auth.put('users/reactivate/' + userName, {});
    }

    deleteUser(user: User): Observable<Boolean> {
        return this.auth.delete('users/' + user.userName);
    }
}
