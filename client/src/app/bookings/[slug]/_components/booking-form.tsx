'use client';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Calendar
} from '@/components/ui';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import * as actions from '@/actions';

const BookingSchema = z.object({
  plateNumber: z.string(),
  dateRange: z.object({
    from: z.date({
      required_error: 'A start date is required.',
    }),
    to: z.date({
      required_error: 'An end date is required.',
    }),
  }),
});

interface BookingFormProps {
  carPlates: string[];
  disabledRanges: {
    from: Date;
    to: Date;
  }[];
}

export default function BookingForm({
  carPlates,
  disabledRanges,
}: BookingFormProps) {
  const form = useForm<z.infer<typeof BookingSchema>>({
    resolver: zodResolver(BookingSchema),
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const timerId = useRef<NodeJS.Timeout>(undefined);

  async function calcPriceHandler(data: z.infer<typeof BookingSchema>) {
    if (!timerId.current) {
      timerId.current = setTimeout(async () => {
        const result = await actions.calculateCost({
          plateNumber: data.plateNumber,
          startedAt: data.dateRange.from,
          endedAt: data.dateRange.to,
        });

        if (result.success) {
          setTotalPrice(result.data || 0);
        } else {
          toast('Cannot calculate the price.');
        }
        clearTimeout(timerId.current);
        timerId.current = undefined;
      }, 500);
    }
  }

  async function onSubmit(data: z.infer<typeof BookingSchema>) {
    const result = await actions.booking({
      plateNumber: data.plateNumber,
      startedAt: data.dateRange.from,
      endedAt: data.dateRange.to,
    });

    console.log(result)

    if (result.success) {
      toast('You submitted the following values:', {
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } else {
      toast('You submission failed.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex justify-center'
      >
        <div className='flex flex-col gap-4 w-2/3'>
          <FormField
            control={form.control}
            name='plateNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Select the car's plate`}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Plate number' />
                    </SelectTrigger>
                    <SelectContent>
                      {carPlates.map((plate) => (
                        <SelectItem value={plate} key={plate}>
                          {plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.formState.errors.plateNumber?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dateRange'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Choose your date range</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        id='date'
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, 'LLL dd, y')} -{' '}
                              {format(field.value.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(field.value.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      initialFocus
                      mode='range'
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={async (event) => {
                        field.onChange(event);
                        await calcPriceHandler(form.getValues());
                      }}
                      numberOfMonths={2}
                      disabled={disabledRanges}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className='text-red-500 mt-2'>
              {form.formState.errors.root.message}
            </p>
          )}

          <div className='flex flex-col md:flex-row gap-4 justify-between'>
            <div className='flex justify-center items-center'>
              <span className='text-2xl font-extrabold bg-gradient-to-bl from-zinc-500 to-zinc-800 bg-clip-text text-transparent'>
                $ {totalPrice.toFixed(2)}
              </span>
            </div>

            <Button
              type='submit'
              className='cursor-pointer'
              disabled={form.formState.isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
