import { getCarModels } from '@/queries';
import { CarModelCard } from './_components/car-model-card';
import { cookies } from 'next/headers';

export default async function ShowroomPage() {
  const authToken = (await cookies()).get('Authorization')?.value;
  const carModels = await getCarModels();

  if (!carModels.data || !carModels.data?.length) {
    return (
      <div className='w-full flex justify-center'>
        <h1 className='font-bold text-2xl'>No model available.</h1>
      </div>
    );
  }

  return (
    <>
      <div className='w-full flex justify-center'>
        <h1 className='font-bold text-2xl p-4'>Rent the car you prefer</h1>
      </div>

      <div className='w-full flex justify-center'>
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {carModels.data.map((carModel) => (
            <CarModelCard
              key={carModel.id}
              data={carModel}
              authToken={authToken}
            />
          ))}
        </div>
      </div>
    </>
  );
}
