import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EmailModel } from '../Models/email.model';
import { EmailAddress } from '../Models/email.address.model';
import { EmailContent } from '../Models/email.content.model';
import { OccEvent } from 'src/app/events/Models/occ-event.model';

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

  sendEventInvitationEmail(eventGuid: string, emailModel: EmailModel) {
    return this.auth.post('Email/event/invitation/' + eventGuid, emailModel);
  }


  createEmailModel(invitationSubject: string, msgContent: string, from: string): EmailModel {
    const toEmail = new EmailAddress();
    toEmail.email = from; // place holder, will be replaced by backend

    const to: EmailAddress[] = [];
    to.push(toEmail);

    const fromEmail = new EmailAddress();
    fromEmail.email = from;

    const emailContent = new EmailContent();
    emailContent.type = 'text/html';
    emailContent.value = msgContent;

    const content: EmailContent[] = [];
    content.push(emailContent);

    const emailModel = new EmailModel();
    emailModel.personalizations = [({ 'to': to })];
    emailModel.subject = invitationSubject;

    emailModel.from = fromEmail;
    emailModel.content = content;

    return emailModel;
  }
}
