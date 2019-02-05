import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { GetUsersService } from './get-users/Services/get-users.service';
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
import { GuestService } from './guests/Services/guest.service';

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
    GetUsersService,
    EventService,
    GoogleMapsService,
    GuestService
    RegisterService,
    VendorService,
    MatSnackBar,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
