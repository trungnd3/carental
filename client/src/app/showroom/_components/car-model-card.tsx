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

type CarModelCardProps = React.ComponentProps<typeof Card> & {
  data: ICarModel;
  authToken: string | undefined;
};

export function CarModelCard({
  className,
  data,
  authToken,
  ...props
}: CarModelCardProps) {

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
