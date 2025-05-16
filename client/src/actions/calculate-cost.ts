'use server';

import { API_BASE_URL } from '@/constants';
import { IBookingData } from '@/interfaces';
import { abstractAction } from './abstract';

export async function calculateCost(pricingData: IBookingData): Promise<{
  success: boolean;
  message: string;
  data: number | null;
}> {
  if (!pricingData.plateNumber) {
    return {
      success: false,
      message: 'Must pick a car first',
      data: null,
    };
  }

  return abstractAction<IBookingData, number>(`${API_BASE_URL}/bookings/calculate-price`, pricingData);
}
