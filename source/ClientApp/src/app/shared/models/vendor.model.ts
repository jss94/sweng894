import { Address } from 'src/app/shared/models/address.model';
import { VendorServices } from 'src/app/shared/models/vendor-services.model';

export interface Vendor {
    id?: number;
    userName: string;
    name: string;
    website: string;
    phone: string;
    address?: Address;
    services?: VendorServices[];
}
