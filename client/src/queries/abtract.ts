'use server';

import { cookies } from 'next/headers';

export async function abstractQuery<T>(endpoint: string): Promise<{
  success: boolean;
  data: T | null;
  error: {
    code: number;
    message: string;
  } | null;
}> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('Authorization')?.value;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `${authToken}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
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
      data: null,
      error: {
        code: 500,
        message: 'Unexpected error',
      },
    };
  }
}
