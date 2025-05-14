'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  async function onSubmit(data: z.infer<typeof BookingSchema>) {
    const result = await actions.booking({
      plateNumber: data.plateNumber,
      startedAt: data.dateRange.from,
      endedAt: data.dateRange.to,
    });

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
                      onSelect={field.onChange}
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

          <Button
            type='submit'
            className='cursor-pointer'
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
