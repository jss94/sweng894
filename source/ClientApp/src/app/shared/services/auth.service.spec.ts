import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('AuthService', () => {

  let sut: AuthService; // System under test
  let router: Router;
  let httpClient: HttpClient;
  let fakeAuthResult = {
    accessToken: '',
    idToken: '',
  };

  beforeEach(async() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: () => {} } },
        HttpClient,

      ],
        imports: [
          HttpClientModule,
        ]
    });
  });

  beforeEach(() => {
    router = TestBed.get(Router);
    httpClient = TestBed.get(HttpClient);
    sut = new AuthService('', router, httpClient);
  });

  it('should be created.', () => {
    expect(sut).toBeTruthy();
  });

  describe('handleAuthentication()', () => {
    it('should handle authentication and navigate home', () => {
      // arrange
      spyOn(sut.auth0, 'parseHash').and.callFake(function(err, authResult, callback) {
        callback(err, authResult);
        // console.log(err)
      });
      spyOn(router, 'navigate').and.callThrough();

      // act
      sut.handleAuthentication();

      // assert
      expect(sut.auth0.parseHash).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledTimes(1);

    });
  });
});

