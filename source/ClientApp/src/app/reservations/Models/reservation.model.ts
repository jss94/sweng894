import { OccEvent } from '../../events/Models/occ-event.model';
import { Vendor } from 'src/app/shared/models/vendor.model';
import { VendorServices } from 'src/app/shared/models/vendor-services.model'

export interface Reservation {
    id: number
    userName: string
    eventId: string
    vendorId: number
    vendorServiceId: number
    status: string
    numberReserved: number
    service: VendorServices
    event: OccEvent
    vendor: Vendor
}