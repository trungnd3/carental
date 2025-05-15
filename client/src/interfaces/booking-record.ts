export interface IBookingRecord {
  id:         number;
  userId:     number;
  carId:      number;
  startedAt:  Date;
  endedAt:    Date;
  totalPrice: number;
}
