import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user.model';
import { Observable } from 'rxjs';

@Injectable()
export class GetUsersService {
    constructor(
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) {
    }

    getUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.baseUrl + 'api/Users');
    }
}
