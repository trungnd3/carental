'use server';

import { API_BASE_URL } from '@/constants';
import { ICarModel } from '@/interfaces';
import { abstractQuery } from './abtract';

export async function getCarModels() {
  return abstractQuery<ICarModel[]>(`${API_BASE_URL}/cars/models/all`);
}
