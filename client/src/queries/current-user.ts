'use server';

import { API_BASE_URL } from '@/constants';
import { abstractQuery } from './abtract';
import { IUser } from '@/interfaces';

export async function getCurrentUser() {
  return abstractQuery<IUser>(
    `${API_BASE_URL}/auth/current-user`
  );

}
