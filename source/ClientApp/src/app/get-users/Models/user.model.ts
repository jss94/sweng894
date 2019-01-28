import { Address } from 'src/app/shared/models/address.model';

export interface User {
    userName: string;
    name: string;
    role: string;
    address?: Address;
}
