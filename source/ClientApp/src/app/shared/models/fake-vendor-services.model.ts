import { VendorServices } from './vendor-services.model';

export class FakeVendorServices implements VendorServices {
    vendorId = 999;
    serviceType = 'Catering';
    serviceName = 'Fake Catering Service';
    serviceDescription = 'some description for the fake service';
    flatFee = true;
    price = 10000;
    unitsAvailable = undefined;


}

export class FakeVendorServicesGroup {
    arr = [ new FakeVendorServices(), new FakeVendorServices, new FakeVendorServices ];
}
