import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// AML
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs/internal/observable/of';
import { DatePipe } from '@angular/common';
import { UpdateGuestsComponent, UpdateGuestData } from './update-guests.component';
import { FakeGuest } from './Models/fake.guest.model';
import { MockMatDialogRef } from '../reactivate-user/reactivate-user.component.spec';

export class MockMatDialogRefGuest extends MockMatDialogRef {
  result: any;
  close(dialogResult: any): void { this.result = dialogResult; }
}

describe('UpdateGuestsComponent', () => {
  let component: UpdateGuestsComponent;
  let fixture: ComponentFixture<UpdateGuestsComponent>;

  let mockDialogRef: MockMatDialogRefGuest;

  let data: UpdateGuestData;
  let eut: FakeGuest;
  eut = new FakeGuest();
  data = {
    guest: eut
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UpdateGuestsComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRefGuest },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockDialogRef = TestBed.get(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.updateGuestForm.controls['name'].value).toEqual(eut.name);
    expect(component.updateGuestForm.controls['email'].value).toEqual(eut.email);
  });

  it('should update guest to not going', () => {
    spyOn(mockDialogRef, 'close').and.callThrough();

    let expectedGuest: FakeGuest;
    expectedGuest = new FakeGuest();
    expectedGuest.name = 'A New Guest Name';
    expectedGuest.email = 'new@example.com';
    expectedGuest.isGoing = false;

    component.updateGuestForm.controls['name'].setValue(expectedGuest.name);
    component.updateGuestForm.controls['email'].setValue(expectedGuest.email);
    component.selectedValue = 'no';

    component.onClick(true);

    expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: {
        save: true,
        guest: expectedGuest
      }
    });
  });

//   it('should update guest to undecided', () => {
//     spyOn(mockDialogRef, 'close').and.callThrough();

//     let expectedGuest1: FakeGuest;
//     expectedGuest1 = new FakeGuest();
//     expectedGuest1.name = 'A New Guest Name';
//     expectedGuest1.email = 'new@example.com';
//     expectedGuest1.isGoing = null;

//     component.updateGuestForm.controls['name'].setValue(expectedGuest1.name);
//     component.updateGuestForm.controls['email'].setValue(expectedGuest1.email);
//     component.selectedValue = 'undecided';

//     component.onClick(true);

//     expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
//     expect(mockDialogRef.close).toHaveBeenCalledWith({
//       data: {
//         save: true,
//         guest: expectedGuest1
//       }
//     });
//   });


});
