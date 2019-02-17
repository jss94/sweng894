import { Address } from './address.model';

export class FakeAddress implements Address {
    userName = 'Some Student';
    street = 'Old Main';
    city = 'State College';
    state = 'PA';
    zip = 16801;
}
