'use server';

import { cookies } from 'next/headers';

export async function logoutUser() {
  try {
    (await cookies()).set({
      name: 'Authorization',
      value: '',
      path: '/',
      httpOnly: true,
      secure: false,
      expires: new Date(0),
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to log out' };
  }
}
