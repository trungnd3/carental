import { getCarModels } from '@/queries/car-models';
import { CarModelCard } from './_components/car-model-card';

export default async function ShowroomPage() {
  const carModels = await getCarModels();
  console.log(carModels);

  return (
    <>
      <div className='w-full flex justify-center'>
        <h1 className='font-bold text-2xl'>Rent the car you prefer</h1>
      </div>

      <div className='w-full flex justify-center'>
        <div className='grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {carModels.data.map((carModel) => (
            <CarModelCard key={carModel.id} data={carModel} />
          ))}
        </div>
      </div>
    </>
  );
}
