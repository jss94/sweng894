import { Reservation } from './reservation.model';
import { OccEvent } from '../../events/Models/occ-event.model';
import { Vendor } from 'src/app/shared/models/vendor.model';
import { VendorServices } from 'src/app/shared/models/vendor-services.model'

export class FakeReservation implements Reservation {
    serv: VendorServices = {
        id: 1,
        vendorId: 1,
        serviceType: "Venue",
        serviceName: "Zach's Place",
        serviceDescription: "Place To Do Stuff",
        flatFee: true,
        price: 100.00,
        unitsAvailable: 10,
        googleId: "id"
    };
    event: OccEvent = {
        userName: "Debs",
        name: "Fun Party",
        description: "Wooooo",
        dateTime: Date(),
        created: Date(),
    };
    ven: Vendor = {
        userName: "Zach",
        name: "Zach",
        website: "Zach@Zach.com",
        phone: "111-111-1111",
    };
    id = 1
    vendorId = 1
    userName = "Zach"
    eventId = "1"
    vendorServiceId = 1
    status = "New"
    numberReserved = 20
    vendorService = this.serv
    evt = this.event
    vendor = this.ven
}

export class FakeReservations {
    arr = [ new FakeReservation(), new FakeReservation(), new FakeReservation() ];
}