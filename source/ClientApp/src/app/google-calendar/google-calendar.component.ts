import { Component, OnInit } from '@angular/core';
import { GoogleApiService, NgGapiClientConfig, GoogleAuthService } from 'ng-gapi';

@Component({
    selector: 'app-google-calendar',
    templateUrl: './google-calendar.component.html',
    styleUrls: ['./google-calendar.component.css']
  })
export class GoogleCalendarComponent implements OnInit {

    private config: NgGapiClientConfig;
    private apiKey = 'AIzaSyAPXL2x5oGIEbN-x40FIDXqfyUTVaAPcY8';
    private clientId = '7799254029fe4a49d5864f68ba50013a7745b2db';

    public  SESSION_STORAGE_KEY = 'accessToken';
    private user;

    constructor(
        private gapiService: GoogleApiService,
        private googleAuth: GoogleAuthService,
    ) {
        gapiService.onLoad().subscribe(results => {
            console.log(results);
        });
    }

    ngOnInit() {
        this.signIn();
    }

    // public getToken(): string {
    //     const token: string = sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
    //     if (!token) {
    //         throw new Error("no token set , authentication required");
    //     }
    //     return sessionStorage.getItem(UserService.SESSION_STORAGE_KEY);
    // }

    public signIn(): void {
        this.googleAuth.getAuth()
            .subscribe((auth) => {
                auth.signIn().then(res => this.signInSuccessHandler(res));
            });
    }

    private signInSuccessHandler(res: any) {
            this.user = res;
            console.log(this.user)
            // sessionStorage.setItem(
            //     UserService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token
            // );
        }

}
