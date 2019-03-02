import { Guest } from './guest.model';

export class FakeGuest implements Guest {
    name = 'Name Of Person';
    email = 'person@email.com';
    isGoing = true;
    eventGuid: '1';
}

export class FakeGuests {
    arr = [ new FakeGuest(), new FakeGuest(), new FakeGuest() ];
}
