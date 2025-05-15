import Image from 'next/image';
import BookingForm from './_components/booking-form';
import { getCarModelBySlug } from '@/queries';
import { getOwnBookingRecords } from '@/queries';
import { ICarModel } from '@/interfaces';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BookingCarForModelProps {
  params: Promise<{ slug: string }>;
}
/**
     startedDate: 1,
    startedMonth: 5,
    endedDate: 15,
    endedMonth: 8,
  };
  private readonly firstMidSeason = {
    startedDate: 16,
    startedMonth: 8,
    endedDate: 31,
    endedMonth: 9,
  };
  private readonly secondMidSeason = {
    startedDate: 1,
    startedMonth: 2,
    endedDate: 31,
    endedMonth: 4,
  };
  private readonly offSeason = {
    startedDate: 1,
    startedMonth: 10,
    endedDate: 1,
    endedMonth: 2,

      peakSeasonPrice Float
  midSeasonPrice  Float
  offSeasonPrice  Float
 */
const SEASON_PRICES = [
  {
    type: 'peakSeasonPrice' as keyof ICarModel,
    name: 'Peak Season',
    from: 'June 1st',
    to: 'Sep 15th',
  },
  {
    type: 'midSeasonPrice' as keyof ICarModel,
    name: 'Mid Season',
    from: 'Sep 16th',
    to: 'Oct 31st',
  },
  {
    type: 'midSeasonPrice' as keyof ICarModel,
    name: 'Mid Season',
    from: 'Mar 2nd',
    to: 'May 31st',
  },
  {
    type: 'offSeasonPrice' as keyof ICarModel,
    name: 'Off Season',
    from: 'Nov 1st',
    to: 'Mar 1st',
  },
];

export default async function BookingCarForModel({
  params,
}: BookingCarForModelProps) {
  const { slug } = await params;
  const carModel = await getCarModelBySlug(slug);

  if (!carModel || !carModel.data) {
    return (
      <div className='w-full flex justify-center'>
        <h1 className='font-bold text-2xl'>No model available.</h1>
      </div>
    );
  }

  const modelData = carModel.data;

  const bookingRecords = await getOwnBookingRecords();
  const disabledRanges =
    bookingRecords.data?.map((record) => ({
      from: new Date(record.startedAt),
      to: new Date(record.endedAt),
    })) || [];

  return (
    <div className='w-full h-full'>
      <div className='w-full flex flex-col justify-center items-center p-4'>
        <h1 className='font-bold text-2xl'>Car booking</h1>
        <p>Choose the available date range.</p>
      </div>

      <div className='w-full flex flex-col gap-8 justify-center'>
        <Image
          src={carModel.data.images[0]}
          alt={`${carModel.data.brand}, ${carModel.data.model}`}
          width='0'
          height='0'
          sizes='100vw'
          className='w-full h-full max-h-[250px] object-cover'
        />

        <Table>
          <TableCaption>Season Price of this model</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Season</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className='w-[150px] text-center'>Price / day</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SEASON_PRICES.map((price, i) => (
              <TableRow key={i}>
                <TableCell className='font-medium'>{price.name}</TableCell>
                <TableCell>{price.from}</TableCell>
                <TableCell>{price.to}</TableCell>
                <TableCell className='font-bold text-right'>
                  ${modelData[price.type]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <BookingForm
          carPlates={carModel.data.cars}
          disabledRanges={disabledRanges}
        />
      </div>
    </div>
  );
}
