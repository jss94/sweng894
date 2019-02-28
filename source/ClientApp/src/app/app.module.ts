import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { UsersService } from './users/Services/users.service';
import { EventService } from './events/Services/event.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './app.router.module';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { GoogleMapsService } from './google-map/Services/google-maps.service';
import { MatSnackBar } from '@angular/material';
import { MaterialModule } from './material.module';
import { RegisterService } from './register/Services/register.service';
import { VendorService } from './vendors/Services/vendor.service';
import { GuestsService } from './guests/Services/guests.service';
import { UserProfileService } from './user-profile/Services/user-profile.service';
import { EmailService } from './send-email/Services/email.service';
import { VendorSearchService } from './vendor-search/Services/vendor-search.service';
import { InvitationService } from './invitations/Services/invitation.service';
import { ReservationsService } from './reservations/Services/reservations.service';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  exports: [
  ],
  providers: [
    AuthService,
    UsersService,
    EventService,
    EmailService,
    GoogleMapsService,
    GuestsService,
    RegisterService,
    VendorService,
    MatSnackBar,
    UserProfileService,
    VendorSearchService,
    InvitationService,
    ReservationsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
