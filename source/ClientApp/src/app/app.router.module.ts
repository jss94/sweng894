import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
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
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: UsersComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'learn-more', component: LearnMoreComponent},
    { path: 'search-vendors', component: GoogleMapComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/:userName/:eventId', component: EventDetailComponent },
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'deactivate-user', component: DeactivateUserComponent },
    { path: 'reactivate-user', component: ReactivateUserComponent },
    { path: 'register-vendor', component: RegisterVendorComponent },
    { path: 'guests/:eventId', component: GuestsComponent },
    { path: 'update-guests/:guestId', component: UpdateGuestsComponent },
    { path: 'vendor-services', component: VendorServicesComponent },
    { path: 'update-vendor-services/:id', component: UpdateVendorServicesComponent },
    { path: 'vendor-details/:id', component: VendorDetailsComponent },
  ];

@NgModule({
    declarations: [
        HomeComponent,
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
        VendorDetailsComponent,
    ],

    imports: [
        RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
        CommonModule,
        BrowserModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [ RouterModule ]
})

export class RoutingModule {}
