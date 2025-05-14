'use server';

import { API_BASE_URL } from '@/constants';
import { abstractQuery } from './abtract';
import { IBookingRecord } from '@/interfaces';

export async function getCarModelBookings(modelSlug: string) {
  return abstractQuery<IBookingRecord[]>(
    `${API_BASE_URL}/bookings/${modelSlug}`
  );
}
