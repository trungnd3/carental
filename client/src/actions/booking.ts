'use server';

import { API_BASE_URL } from '@/constants';
import { IBookingData, IBookingRecord } from '@/interfaces';
import { abstractAction } from './abstract';

export async function booking(bookingData: IBookingData) {
  return abstractAction<IBookingData, IBookingRecord[]>(
    `${API_BASE_URL}/bookings`,
    bookingData
  );
}
