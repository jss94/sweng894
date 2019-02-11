import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockUsersService {
    constructor() {
    }

    getUsers(): Observable<User[]> {
        return of(null);
    }

    getUser(id: string): Observable<User> {
        return of(null);
    }

    registerUser(id: string): void {

    }
}
