'use server';

import { API_BASE_URL } from '@/constants';
import { cookies } from 'next/headers';

export async function getCarModels() {
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

    console.log(response)
    if (!response.ok) {
      return { success: false };
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}
