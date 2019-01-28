import { Component } from '@angular/core';
import { User } from './Models/user.model';
import { GetUsersService } from './Services/get-users.service';

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: [ './get-users.component.css']
})
export class GetUsersComponent {
  public users: User[];

  constructor(private service: GetUsersService) {
    this.service.getUsers().subscribe(response => {
      this.users = response;
    });
  }
}
