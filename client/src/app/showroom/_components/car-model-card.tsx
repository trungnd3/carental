'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ICarModel } from '@/interfaces/car-model';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

type CarModelCardProps = React.ComponentProps<typeof Card> & {
  data: ICarModel;
};

export async function CarModelCard({
  className,
  data,
  ...props
}: CarModelCardProps) {
  const authToken = (await cookies()).get('Authorization')?.value;

  function handleClick() {
    if (!authToken) {
      alert('You must login to rent the car.');
    }
    redirect(`/bookings/${data.id}`);
  }

  return (
    <Card className={cn('flex flex-col w-full h-full', className)} {...props}>
      <CardHeader>
        <CardTitle>{data.brand}</CardTitle>
        <CardDescription>{data.model}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='relative px-0 flex-1 w-full h-full'>
          <Image
            src={data.images[0]}
            alt={`${data.brand}, ${data.model}`}
            width='0'
            height='0'
            sizes='100vw'
            className='w-full h-full max-h-[250px] object-cover'
          />
        </div>
      </CardContent>
      {authToken && (
        <CardFooter>
          <Button className='w-full' onClick={handleClick}>
            Rent
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
