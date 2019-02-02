import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/models/user.model';

@Injectable()
export class RegisterService {
    constructor(
        private auth: AuthService,
        ) {
    }

    getUsers(): Observable<User[]> {
        return this.auth.Get('users');
    }

    getUser(id: string): Observable<User> {
        return this.auth.Get('users/' + id);
    }

    registerUser(user: User, password: string): Observable<[User, any]> {
        return forkJoin(
            this.auth.Post('users', user),
            this.auth.auth0Signup(user, password)
        );
    }
}
