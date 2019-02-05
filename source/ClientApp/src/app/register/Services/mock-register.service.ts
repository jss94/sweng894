import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';

@Injectable()
export class MockRegisterService {
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

    registerVendor(id: string): void {

    }
}
