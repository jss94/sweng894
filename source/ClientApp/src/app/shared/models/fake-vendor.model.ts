import { Address } from 'src/app/shared/models/address.model';
import { Vendor } from './vendor.model';
import { FakeAddress } from 'src/app/shared/models/fake-address.model';

export class FakeVendor implements Vendor {
    id = 1001;
    userName = 'vendor@email.com';
    name = 'Vendor Name';
    website = 'www.avendor.com';
    phone = '5555555';
    address = new FakeAddress();
}

export class FakeVendors {
    arr = [
        new FakeVendor(),
        new FakeVendor(),
        new FakeVendor()
    ];
}
