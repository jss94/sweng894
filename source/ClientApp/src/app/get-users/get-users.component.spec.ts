import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GetUsersComponent } from './get-users.component';
import { GetUsersService } from './Services/get-users.service';
import { MockGetUsersService } from './Services/mock-get-users.service';

describe('GetUsers', () => {
  let component: GetUsersComponent;
  let fixture: ComponentFixture<GetUsersComponent>;
  let mockUsersService: GetUsersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetUsersComponent ],
      providers: [
        { provide: GetUsersService, useClass: MockGetUsersService },
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetUsersComponent);
    component = fixture.componentInstance;
    mockUsersService = TestBed.get(GetUsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
