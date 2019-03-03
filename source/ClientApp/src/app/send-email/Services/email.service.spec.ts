import { TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MockAuthService } from 'src/app/shared/services/mock-auth.service';
import { FakeUsers, FakeUser } from 'src/app/shared/models/fake-user.model';
import { of } from 'rxjs/internal/observable/of';
import { EmailService } from './email.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmailModel } from '../Models/email.model';
import { EmailAddress } from '../Models/email.address.model';

describe('EmailService', () => {

  let sut: EmailService; // System under test
  let mockAuthService: AuthService;
  let mockHttpClient: HttpClient;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useClass: HttpClient},
        { provide: AuthService, useClass: MockAuthService },
      ],
    });
  });

  beforeEach(() => {
    mockAuthService = TestBed.get(AuthService);
    sut = new EmailService(mockHttpClient, mockAuthService);
  });

  it('should be created.', () => {
    expect(sut).toBeTruthy();
  });

  describe('sendVendorQuestionEmail', () => {
    it('should return 202 Status Code', (done) => {
      // arrange
      spyOn(mockAuthService, 'post').and.returnValue(of(202));

      // act
      sut.sendVendorQuestionEmail(1, new EmailModel()).subscribe((result) => {
        // assert
        expect(mockAuthService.post).toHaveBeenCalledTimes(1);
        expect(result).toEqual(202);
        done();
      });

    });
  });

  describe('sendEventInvitationEmail', () => {
    it('should return 202 Status Code', (done) => {
       // arrange
       spyOn(mockAuthService, 'post').and.returnValue(of(202));

       // act
       sut.sendEventInvitationEmail('1234', new EmailModel()).subscribe((result) => {
         // assert
         expect(mockAuthService.post).toHaveBeenCalledTimes(1);
         expect(result).toEqual(202);
         done();
       });

    });
  });

  describe('createEmailModel', () => {
    it('should create EmailModel', (done) => {

      // act
      const createdEmailModel = sut.createEmailModel('mySubject', 'myMessageContent', 'fromMe@me.com');

      // assert
      expect(createdEmailModel.content.length).toEqual(1);
      expect(createdEmailModel.content[0].type).toEqual('text/html');
      expect(createdEmailModel.content[0].value).toEqual('myMessageContent');
      expect(createdEmailModel.from.email).toEqual('fromMe@me.com');
      expect(createdEmailModel.subject).toEqual('mySubject');
      expect(createdEmailModel.personalizations.length).toEqual(1);
      expect(createdEmailModel.personalizations[0].to.length).toEqual(1);
      // the to is looked up on the server, this is just a place holder.
      expect(createdEmailModel.personalizations[0].to[0].email).toEqual('fromMe@me.com');
      done();


    });
  });
});

