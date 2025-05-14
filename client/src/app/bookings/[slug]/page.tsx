import Image from 'next/image';
import BookingForm from './_components/booking-form';
import { getCarModelBySlug } from '@/queries';
import { getOwnBookingRecords } from '@/queries/own-booking-records';

interface BookingCarForModelProps {
  params: Promise<{ slug: string }>;
}

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

  const bookingRecords = await getOwnBookingRecords();
  const disabledRanges = bookingRecords.data?.map((record) => ({
    from: new Date(record.startedAt),
    to: new Date(record.endedAt),
  })) || []

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

        <BookingForm carPlates={carModel.data.cars} disabledRanges={disabledRanges} />
      </div>
    </div>
  );
}
