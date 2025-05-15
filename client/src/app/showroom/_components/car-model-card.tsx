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
import { ICarModel } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <Card className={cn('flex flex-col w-full h-full', className)} {...props}>
      <CardHeader>
        <CardTitle>{data.brand}</CardTitle>
        <CardDescription>{data.model}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1'>
        <div className='relative px-0 w-full h-full'>
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
          <Button asChild variant='default'>
            <Link className='w-full' href={`/bookings/${data.slug}`}>
              Rent
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
