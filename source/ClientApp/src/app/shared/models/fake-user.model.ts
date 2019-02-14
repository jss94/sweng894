
import { FakeAddress } from 'src/app/shared/models/fake-address.model';
import { User } from './user.model';

export class FakeUser implements User {
    userName =  'my@UserName.com';
    name = 'My First and Last Name';
    role = '';
    address = new FakeAddress();
}

export class FakeUsers {
    arr: User[] = [
        new FakeUser(),
        new FakeUser(),
        new FakeUser(),
    ];
}
