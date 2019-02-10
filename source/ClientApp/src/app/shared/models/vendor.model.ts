import { Address } from 'src/app/shared/models/address.model';
import { VendorService } from 'src/app/vendors/Services/vendor.service';

export interface Vendor {
    id?: number;
    userName: string;
    name: string;
    type: string;
    website: string;
    phone: string;
    address?: Address;
    services?: VendorService[];
}
