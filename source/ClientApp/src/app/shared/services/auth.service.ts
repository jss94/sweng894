import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UsersComponent } from 'src/app/users/users.component';

@Injectable()
export class AuthService {

  private _user: User;
  private _user$ = new Subject<User>();
  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;
  private _clientId = '7tvdINTUbtF7igWDygC7lO90o8BEv27D';
  private _domain = 'sweng894.auth0.com';
  private _connection = 'Username-Password-Authentication';

  _userProfile: any;

  auth0: any;

  constructor(
    @Inject('BASE_URL') private _baseUrl: string,
    public router: Router,
    private http: HttpClient
    ) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;

    this.auth0 = new auth0.WebAuth({
      clientID: this._clientId,
      domain: this._domain,
      responseType: 'token id_token',
      redirectUri: `${_baseUrl}home`,
      audience: `${_baseUrl}api`,
      scope: 'openid profile read:messages delete:users delete:current_user'
    });

  }

  get profile(): any {
    return this._userProfile;
  }

  get user(): User {
    return this._user;
  }

  get user$(): Observable<User> {
    return this._user$;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // TODO: Do not save all of authReult. This was only done for simplicity.
        localStorage.setItem('authResult', JSON.stringify(authResult));

        window.location.hash = '';
        this.localLogin(authResult);
        this.getUser();
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log('Auth Error:', err);
      }
    });
  }

  private localLogin(authResult): void {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  public renewUser(authResult: any): void {
    if (authResult.accessToken && authResult.idTokenPayload) {
      this._accessToken = authResult.accessToken;
      this._userProfile = authResult.idTokenPayload;
      this.getAuthenticatedUser(this._userProfile);
    }
  }

  public logout(): void {
    this.auth0.logout({
      returnTo: this._baseUrl,
      clientID: this._clientId
    });
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;
    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authResult');
    // Go back to the home route
    // this.router.navigate(['/home']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this._expiresAt;
  }

  private getUser() {
    this.auth0.client.userInfo(this._accessToken, (err, profile) => {
      if (profile) {
        this._userProfile = profile;
        this.getAuthenticatedUser(profile);
      }
    });
  }

  private getAuthenticatedUser(userProfile: any) {
    this.get('users/' + userProfile.name).subscribe(result => {
      this._user = result;
      this._user$.next(result);

      console.log('Hello', this._user.name);
    }, (error) => {
      this._user = null;
      this._user$.next(null);
    });
  }

  public auth0Signup(user: User, password: string): Observable<any> {
    return this.http
    .post(`https://${this._domain}/dbconnections/signup`, {
        'client_id': this._clientId,
        'email': user.userName,
        'password': password,
        'connection': this._connection,
    });
  }

  public get(endpoint: string): Observable<any> {
    const url = `${this._baseUrl}api/${endpoint}`;
    const opt = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this._accessToken}`).set('Content-Type', 'application/json'),
    };

    return this.http.get(url, opt);
  }

  public post(endpoint: string, body: any): Observable<any> {
    const url = `${this._baseUrl}api/${endpoint}`;
    const opt = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this._accessToken}`).set('Content-Type', 'application/json'),
    };

    return this.http.post(url, body, opt);
  }

  public put(endpoint: string, body: any): Observable<any> {
    const url = `${this._baseUrl}api/${endpoint}`;
    const opt = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this._accessToken}`).set('Content-Type', 'application/json'),
    };

    return this.http.put(url, body, opt);
  }

  public delete(endpoint: string): Observable<any> {
    const url = `${this._baseUrl}api/${endpoint}`;
    const opt = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this._accessToken}`).set('Content-Type', 'application/json'),
    };

    return this.http.delete(url, opt);
  }
}
