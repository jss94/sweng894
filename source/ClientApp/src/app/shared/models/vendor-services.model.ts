export interface VendorService {
    id: number;
    vendorId: number;
    serviceType: string;
    serviceName: string;
    serviceDescription: string;
    flatFee: boolean;
    price: number;
    unitsAvailable: number;
}
