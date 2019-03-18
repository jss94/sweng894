export interface VendorServices {
    id?: number;
    vendorId: number;
    googleId: string;
    serviceType: string;
    serviceName: string;
    serviceDescription: string;
    flatFee?: boolean;
    price: number;
    unitsAvailable?: number;
}
