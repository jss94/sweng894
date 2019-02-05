import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('AuthService', () => {

  let sut: AuthService; // System under test
  let router: Router;
  let httpClient: HttpClient;

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

});

