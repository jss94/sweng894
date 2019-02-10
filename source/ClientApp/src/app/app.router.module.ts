import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { GetUsersComponent } from './get-users/get-users.component';
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
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: GetUsersComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'learn-more', component: LearnMoreComponent},
    { path: 'search-vendors', component: GoogleMapComponent },
    { path: 'events', component: EventsComponent },
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'register-vendor', component: RegisterVendorComponent },
    { path: 'guests/:eventId', component: GuestsComponent },
  ];

@NgModule({
    declarations: [
        HomeComponent,
        LearnMoreComponent,
        GoogleMapComponent,
        GetUsersComponent,
        EventsComponent,
        GuestsComponent,
        RegisterUserComponent,
        RegisterVendorComponent,
        ProfileComponent,
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
