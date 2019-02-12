import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EmailModel } from '../Models/email.model';

@Injectable()
export class EmailService {

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  sendEmail(emailModel: EmailModel) {
    console.log('IN HERE NOW!!!');
    return this.auth.post('Email/', emailModel);
  }

}
