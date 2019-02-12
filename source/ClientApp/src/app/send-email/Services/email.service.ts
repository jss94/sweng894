import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmailModel } from '../Models/email.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class EmailService {

  constructor(
      private http: HttpClient,
      private auth: AuthService,
      ) {
  }

  printModel(email: EmailModel) {
    console.log(JSON.stringify(email));
  }

  createTestEmail(): EmailModel {
    const email = new EmailModel();
    email.personalizations = [
      { 'to': [{'email': 'senky.joe@gmail.com'}]}
    ];
    email.from = 'sweng894OccasionsApp@gmail.com';
    email.content = [
      { 'type': 'text/plain', value: 'Congrats on your web app email implementation!!' }
    ];
    email.subject = 'You\'re invited to an event!!';
    return email;
  }

  sendEmail(email: EmailModel) {
    console.log('TEST HERE');
    this.printModel(email);
    MailService.setApiKey('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');

    const msg = {
      to: 'senky.joe@gmail.com',
      from: 'test@example.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    MailService.send(msg);
    /*
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data ' jsonObj'
  */

  }

}
