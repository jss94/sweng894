import { OccEvent } from '../../events/Models/occ-event.model';

export interface Reservation {
    vendorId: string
    event: OccEvent
    status: string
    services: string[]
}