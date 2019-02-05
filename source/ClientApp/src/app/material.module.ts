import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { MatSelectModule, MatMenuModule, MatSnackBarModule, MatTableModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  exports: [
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule
  ],
  providers: [
    MatIconRegistry,
  ],
  declarations: [
    SnackbarComponent,
  ],
  entryComponents: [
    SnackbarComponent
  ]
})
export class MaterialModule { }
