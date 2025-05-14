export interface ICarModel {
  id: number;
  brand: string;
  model: string;
  stock: number;
  images: string[];
  peakSeasonPrice: number;
  midSeasonPrice: number;
  offSeasonPrice: number;
  gracePeriod: number;
}
