import { Address } from './address.model';

export class FakeAddress implements Address {
    street = 'Old Main';
    city = 'State College';
    state = 'PA';
    zip = 16801;
}
