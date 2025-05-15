export interface ICarModel {
  id: number;
  brand: string;
  model: string;
  slug: string;
  stock: number;
  images: string[];
  peakSeasonPrice: number;
  midSeasonPrice: number;
  offSeasonPrice: number;
  gracePeriod: number;
  cars: string[];
}
