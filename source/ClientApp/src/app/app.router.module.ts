import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { UsersComponent } from './users/users.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterUserComponent } from './register/register-user/register-user.component';
import { RegisterVendorComponent } from './register/register-vendor/register-vendor.component';
import { LearnMoreComponent } from './learn-more/learn-more.component';
import { EventsComponent } from './events/events.component';
import { GuestsComponent } from './guests/guests.component';
import { UpdateGuestsComponent } from './guests/update-guests.component';
import { DeactivateUserComponent } from './deactivate-user/deactivate-user.component';
import { ReactivateUserComponent } from './reactivate-user/reactivate-user.component';
import { VendorServicesComponent } from './vendor-services/vendor-services.component';
import { VendorComponent } from './vendors/vendor.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UpdateVendorServicesComponent } from './vendor-services/update-vendor-services.component';
import { VendorSearchComponent } from './vendor-search/vendor-search.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import {ReservationsVendorComponent} from './reservations/reservations-vendor/reservations-vendor.component';
import { EventDialogComponent } from './shared/components/event-dialog/event-dialog.component';
import { GuestEntryComponent } from './guest-entry/guest-entry.component';
import { ReserveComponent } from './reservations/reserve/reserve.component';
import { ClaimVendorComponent } from './vendor-search/claim-vendor/claim-vendor.component';
import { FavoriteVendorsComponent } from './favorite-vendors/favorite-vendors.component';
import { VendorMetricsComponent } from './vendor-metrics/vendor-metrics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { createCustomElement } from '@angular/elements';
import { ReservationMetricsComponent } from './vendor-metrics/reservation-metric/reservation-metrics.component';
import { VendorCalendarComponent } from './vendor-calendar/vendor-calendar.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ReservationDialogComponent } from './shared/components/reservation-dialog/reservation-dialog.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: UsersComponent },
    { path: 'guest-entry', component: GuestEntryComponent},
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'learn-more', component: LearnMoreComponent},
    { path: 'search-vendors', component: VendorSearchComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/:guid', component: EventDetailComponent },
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'deactivate-user', component: DeactivateUserComponent },
    { path: 'reactivate-user', component: ReactivateUserComponent },
    { path: 'register-vendor', component: RegisterVendorComponent },
    { path: 'guests/:eventGuid', component: GuestsComponent },
    { path: 'vendor-services', component: VendorServicesComponent },
    { path: 'update-vendor-services/:id', component: UpdateVendorServicesComponent },
    { path: 'vendor-details/:vendorId', component: VendorDetailsComponent },
    { path: 'reservations-vendor', component: ReservationsVendorComponent },
    { path: 'google-map', component: GoogleMapComponent },
    { path: 'claim-vendor/:type/:id', component: ClaimVendorComponent},
    { path: 'reserve/:id', component: ReserveComponent },
    { path: 'vendor-metrics', component: VendorMetricsComponent },
    { path: 'vendor-events/:vendorId', component: VendorCalendarComponent },
  ];

@NgModule({
    declarations: [
        HomeComponent,
        GuestEntryComponent,
        LearnMoreComponent,
        GoogleMapComponent,
        UsersComponent,
        EventsComponent,
        GuestsComponent,
        UpdateGuestsComponent,
        RegisterUserComponent,
        RegisterVendorComponent,
        UserProfileComponent,
        DeactivateUserComponent,
        ReactivateUserComponent,
        VendorComponent,
        VendorServicesComponent,
        EventDetailComponent,
        UpdateVendorServicesComponent,
        VendorSearchComponent,
        VendorDetailsComponent,
        ReservationsVendorComponent,
        EventDialogComponent,
        ReserveComponent,
        ClaimVendorComponent,
        FavoriteVendorsComponent,
        VendorMetricsComponent,
        [ReservationMetricsComponent],
        VendorCalendarComponent,
        ReservationDialogComponent,
    ],

    imports: [
        RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
        CommonModule,
        BrowserModule,
        MaterialModule,
      ReactiveFormsModule,
        FormsModule,
      NgxChartsModule,
      NgbModalModule,
      FlatpickrModule.forRoot(),
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })
    ],
  exports: [RouterModule, VendorCalendarComponent],
  entryComponents: [
    ReservationMetricsComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class RoutingModule {
  constructor(private injector: Injector) { }
  ngDoBootstrap() {
    const monthlyReservationMetricCustomElement = createCustomElement(ReservationMetricsComponent, { injector: this.injector });
    customElements.define('app-reservation-metrics', monthlyReservationMetricCustomElement);
  }
}
