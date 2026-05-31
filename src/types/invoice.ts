import { Timestamp } from "firebase/firestore";

export interface Invoice {
  id?: string;

  invoiceNumber: string;
  invoiceDate: string;

  customerName: string;
  customerMobile: string;

  vehicleType?: string;
  vehicleNumber?: string;

  from: string;
  to: string;

  pickupTime?: string;
  dropTime?: string;

  remarks?: string;

  amount: number;

  createdAt?: Timestamp;
}