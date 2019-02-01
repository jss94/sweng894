import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { GetUsersService } from './get-users/Services/get-users.service';
import { EventService } from './events/Services/event.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './app.router.module';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth.service';
import { CallbackComponent } from './call-back/callback.component';
import { GoogleMapsService } from './google-map/Services/google-maps.service';
import { MatIconModule, MatIconRegistry, MatSnackBar } from '@angular/material';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    CallbackComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
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
    MatSnackBar,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
