'use server';

import { API_BASE_URL } from '@/constants';
import { IBookingData } from '@/interfaces';
import { cookies } from 'next/headers';

export async function calculateCost(pricingData: IBookingData): Promise<{
  success: boolean;
  message: string;
  data: number | null;
}> {
  try {
    if (!pricingData.plateNumber) {
      return {
        success: false,
        message: 'Must pick a car first',
        data: null,
      };
    }

    const token = (await cookies()).get('Authorization')?.value;

    if (!token) {
      return {
        success: false,
        message: 'Unauthorized',
        data: null,
      };
    }

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('authorization', token);

    if (!pricingData.endedAt) {
      pricingData.endedAt = pricingData.startedAt;
    }

    const response = await fetch(`${API_BASE_URL}/bookings/calculate-price`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(pricingData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Unexpected error',
        data: null,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Unexpected error', data: null };
  }
}
