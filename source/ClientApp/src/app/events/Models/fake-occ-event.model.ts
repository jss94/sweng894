import { OccEvent } from './occ-event.model';

export class FakeOccEvent implements OccEvent {
    eventId = 999;
    userName = 'fakeuser@fakeemail.com';
    guestListId = 999;
    name = 'Some Fake Event';
    description = 'Fake event description';
    dateTime = new Date();
    created = new Date();
}

export class FakeOccEvents {
    arr = [ new FakeOccEvent(), new FakeOccEvent(), new FakeOccEvent() ];
}
