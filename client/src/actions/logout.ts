'use server';

import { cookies } from 'next/headers';

export async function logoutUser() {
  try {
    (await cookies()).delete({
      name: 'Authorization',
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to log out' };
  }
}
