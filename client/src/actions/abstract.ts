'use server';

import { cookies } from 'next/headers';

export async function abstractAction<T, K>(
  endpoint: string,
  requestData: T
): Promise<{
  success: boolean;
  message: string;
  data: K | null;
}> {
  try {
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

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestData),
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
