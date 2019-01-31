import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { GetUsersComponent } from './get-users/get-users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { EventComponent } from './events/event.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'find-vendors', component: GoogleMapComponent },
    { path: 'vendor-events', component: GetUsersComponent },
    { path: 'organizer-events', component: EventComponent}
  ];

@NgModule({
    declarations: [
        HomeComponent,
        GoogleMapComponent,
        GetUsersComponent,
        EventComponent,

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
