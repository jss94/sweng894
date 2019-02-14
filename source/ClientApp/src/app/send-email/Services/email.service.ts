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

  sendVendorQuestionEmail(vendorId: number, emailModel: EmailModel) {
    return this.auth.post('Email/vendor/question/' + vendorId, emailModel);
  }

  sendEventInvitationEmail(eventId: number, emailModel: EmailModel) {
    return this.auth.post('Email/event/invitation/' + eventId, emailModel);
  }

}
