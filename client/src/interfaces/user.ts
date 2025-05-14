import { IBookingRecord } from "./booking-record";

export interface IUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  licenseNumber: string;
  licenseValidTo: Date;
  avatar?: string;
  bookingRecords: IBookingRecord[];
}
