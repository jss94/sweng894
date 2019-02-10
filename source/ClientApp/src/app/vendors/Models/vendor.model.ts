import { Address } from 'src/app/shared/models/address.model';
import { VendorService } from '../Services/vendor.service';

export interface Vendor {
    id?: number;
    userName: string;
    name: string;
    website: string;
    phone: string;
    addressId?: number;
    address?: Address;
    services?: VendorService;
}
