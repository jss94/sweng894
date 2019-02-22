import {
    GoogleApiModule,
    GoogleApiService,
    GoogleAuthService,
    NgGapiClientConfig,
    NG_GAPI_CONFIG,
    GoogleApiConfig
} from 'ng-gapi';
import { NgModule } from '@angular/core';
import { GoogleCalendarComponent } from './google-calendar.component';

const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const scope = ['https://www.googleapis.com/auth/calendar.readonly'];
const clientId = '7799254029fe4a49d5864f68ba50013a7745b2db';

const gapiClientConfig: NgGapiClientConfig = {
    client_id: clientId,
    discoveryDocs: discoveryDocs,
    scope: [scope].join(' ')
};

@NgModule({
    declarations: [
        GoogleCalendarComponent,
    ],
    imports: [
        GoogleApiModule.forRoot({
            provide: NG_GAPI_CONFIG,
            useValue: gapiClientConfig
        }),
    ],
    exports: [
        GoogleCalendarComponent,
    ]
})
export class GoogleCalendarModule { }
