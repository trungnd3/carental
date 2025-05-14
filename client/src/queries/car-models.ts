'use server';

import { API_BASE_URL } from '@/constants';
import { ICarModel } from '@/interfaces/car-model';
import { cookies } from 'next/headers';

export async function getCarModels(): Promise<{
  success: boolean;
  data: ICarModel[];
  error: {
    code: number;
    message: string;
  } | null;
}> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('Authorization')?.value;

  try {
    const response = await fetch(`${API_BASE_URL}/cars/models`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `${authToken}`,
      },
    });

    console.log(response);
    if (!response.ok) {
      return {
        success: false,
        data: [] as ICarModel[],
        error: {
          code: response.status,
          message: response.statusText,
        },
      };
    }

    const json = await response.json();
    return { success: true, data: json, error: null };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: [] as ICarModel[],
      error: {
        code: 500,
        message: 'Unexpected error',
      },
    };
  }
}
