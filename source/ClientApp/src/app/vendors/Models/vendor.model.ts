import { Address } from 'src/app/shared/models/address.model';

export interface Vendor {
    id?: number;
    userName: string;
    name: string;
    type: string;
    website: string;
    phone: string;
    addressId?: number;
    address?: Address;
}
