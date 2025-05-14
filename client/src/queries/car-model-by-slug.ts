import { ICarModel } from '@/interfaces';
import { abstractQuery } from './abtract';
import { API_BASE_URL } from '@/constants';

export function getCarModelBySlug(slug: string) {
  return abstractQuery<ICarModel>(`${API_BASE_URL}/cars/${slug}`);
}
