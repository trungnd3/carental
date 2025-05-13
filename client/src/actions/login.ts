'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants';

export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid credentials');
    }

    // Extract the Authorization cookie from the Set-Cookie header
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      // Extract the cookie name and value from the Set-Cookie string
      const [cookiePair] = setCookieHeader.split(';');
      const [cookieName, cookieValue] = cookiePair.split('=');

      // Set the cookie in the Next.js server environment
      (await cookies()).set({
        name: cookieName.trim(),
        value: cookieValue.trim(),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Adjust as needed
        path: '/', // Ensure the cookie is available on all pages
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Unexpected error' };
  }
}
