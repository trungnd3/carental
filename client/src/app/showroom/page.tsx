import { getCarModels } from '@/queries/car-models';

export default async function ShowroomPage() {
  const carModels = await getCarModels();
  console.log(carModels);

  return (
    <div>
      <h1>Showroom page</h1>
    </div>
  );
}
