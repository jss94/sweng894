import { OccEvent } from '../../events/Models/occ-event.model';
import { Vendor } from 'src/app/shared/models/vendor.model';

export interface Reservation {
    id: number
    vendorId: string
    event: OccEvent
    vendor: Vendor
    status: string
    services: string[]
}