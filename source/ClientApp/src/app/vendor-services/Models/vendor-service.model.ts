export interface VendorServiceModel {
  id?: number;
  vendorId: number;
  serviceType: string;
  serviceName: string;
  serviceDescription: string;
  flatFee: boolean;
  price: Float32Array;
  unitsAvailable: number; 
}
  