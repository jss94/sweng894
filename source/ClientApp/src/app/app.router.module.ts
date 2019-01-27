import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { GetUsersComponent } from './get-users/get-users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'vendors', component: GoogleMapComponent },
    { path: 'organizers', component: GetUsersComponent },
  ];

@NgModule({
    declarations: [
        HomeComponent,
        GoogleMapComponent,
        GetUsersComponent,
    ],

    imports: [
        RouterModule.forRoot(routes),
        CommonModule,
        BrowserModule,
    ],

    exports: [ RouterModule ]
})

export class RoutingModule {}
