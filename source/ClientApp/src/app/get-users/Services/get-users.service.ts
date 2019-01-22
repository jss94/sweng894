import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class GetUsersService {
    constructor(
        private http: HttpClient,
        private auth: AuthService,
        ) {
    }

    getUsers(): Observable<User[]> {
        return this.auth.authGet('users');
    }

    getUser(id: string): Observable<User> {
        return this.auth.authGet('user/' + id);
    }
}
