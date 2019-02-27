import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VendorServicesService } from '../vendor-services/Services/vendor-services.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { VendorServices } from '../shared/models/vendor-services.model';
import { Vendor } from '../shared/models/vendor.model';
import { Address } from '../shared/models/address.model';
import { User } from '../shared/models/user.model';
import { EmailService } from '../send-email/Services/email.service';
import { EmailDialogComponent } from '../shared/components/email-dialog/email-dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { EmailModel } from '../send-email/Models/email.model';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {

  vendor: Vendor;
  vendorServices: VendorServices[];

  constructor(
    private auth: AuthService,
    private vendorServicesService: VendorServicesService,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private emailService: EmailService,
    ) {
  }

  ngOnInit() {
    this.setVendor();
  }

  setVendor() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const vendorId = +params.get('vendorId');
      this.vendorService.getVendorById(vendorId).subscribe(vendor => {
        this.vendor = vendor;
        this.vendorServicesService.getVendorServices(vendor.id).subscribe(response => {
          this.vendorServices = response;
        });
      }, error => {
        console.log(error);
      });
    });
  }

  loadQuestion() {
    console.log('Let\'s ask a Questoin');

    const dialogRef = this.dialog.open(EmailDialogComponent, {
      width: '600px',
      data: {
          iconName: 'question_answer',
          title: 'Ask a Question',
          subject: 'Regarding ' + this.vendor.name,
          content: 'Enter your question here',
          buttonText1: 'Cancel',
          buttonText2: 'Send'
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {

        // update content and subject of invitation
        const userContent = result.data.content;
        const userSubject = result.data.subject;

        // save the invitation first
       if (result.data.button === true) {
            // send the invitation
            this.sendEmail(userSubject, userContent, this.auth.user.userName).subscribe(emailResponse => {
            this.displayEmailFeedback(emailResponse);
          });
        }
      });
  }

  sendEmail(subject: string, content: string, from: string): Observable<any> {
    const emailModel: EmailModel = this.emailService.createEmailModel(subject,
    content, from);
    return this.emailService.sendVendorQuestionEmail(this.vendor.id, emailModel);
  }

  displayEmailFeedback(response: any) {
    let statusMsg = 'Successfully sent your question to ' + this.vendor.name + '!';

    if (response !== 202) {
      statusMsg = 'An error occurred sending the email, please contact your administrator.';
    }

    this.snackbar.open(statusMsg, '', {
      duration: 3000
    });
  }
}
