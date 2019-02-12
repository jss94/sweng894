import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class EmailService {

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  sendEmail(msg: string) {
    console.log('TEST HERE');
    return this.auth.post('email/', msg);
  }

}
