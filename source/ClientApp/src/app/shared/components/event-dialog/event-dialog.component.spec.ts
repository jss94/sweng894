import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// AML
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';
import { MockMatDialog, MockMatDialogRef } from '../../../reactivate-user/reactivate-user.component.spec';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventDialogData } from './event-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs/internal/observable/of';

import { EventDialogComponent } from './event-dialog.component';
import { FakeOccEvent } from 'src/app/events/Models/fake-occ-event.model';

export class MockMatDialogRefEvent extends MockMatDialogRef {
  result: any;
  close(dialogResult: any): void { this.result = dialogResult; }
}

// export class MockMatDialogEvent extends MockMatDialog {
//   // data: any;
//   close(obj: Object): void {  }
// }

describe('EventDialogComponent', () => {
  let component: EventDialogComponent;
  let fixture: ComponentFixture<EventDialogComponent>;

  // AML
  let mockDialogRef: MockMatDialogRefEvent;

  // AML
  let data: EventDialogData;
  let eut: FakeOccEvent;
  eut = new FakeOccEvent();
  data = {
    iconName: 'event',
    title: eut.name,
    buttonText: 'Update',
    event: eut
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EventDialogComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        // { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatDialogRef, useClass: MockMatDialogRefEvent },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockDialogRef = TestBed.get(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.editEventForm.controls['name'].value).toEqual(eut.name);
    expect(component.editEventForm.controls['date'].value).toEqual(eut.dateTime);
    expect(component.editEventForm.controls['description'].value).toEqual(eut.description);
  });

  it('should update event', () => {
    spyOn(mockDialogRef, 'close').and.callThrough();

    component.editEventForm.controls['name'].setValue('A New Event Name');
    component.editEventForm.controls['date'].setValue(new Date('1970-01-01 12:00:00'));
    component.editEventForm.controls['description'].setValue('A New Event Description');

    component.onClick(true);

    expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      data: {
        newName: 'A New Event Name',
        newDate: new Date('1970-01-01 12:00:00').toISOString().slice(0, 19).replace('T', ' '),
        newDescription: 'A New Event Description',
        save: true,
        event: eut
      }
    });
  });
});
