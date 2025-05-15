import { IBookingRecord } from '@/interfaces';
import { abstractQuery } from './abtract';
import { API_BASE_URL } from '@/constants';

export async function getOwnBookingRecords() {
  return abstractQuery<IBookingRecord[]>(
    `${API_BASE_URL}/bookings/records/own`
  );
}
