// components/CalendarWithDropdown.tsx
"use client";

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { months, years } from '@/lib/utils';

interface CalendarWithDropdownProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export const CalendarWithDropdown: React.FC<CalendarWithDropdownProps> = ({ value, onChange }) => {
  const [month, setMonth] = useState(value ? value.getMonth() : new Date().getMonth());
  const [year, setYear] = useState(value ? value.getFullYear() : new Date().getFullYear());

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(Number(event.target.value));
    onChange(new Date(year, Number(event.target.value), 1));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(event.target.value));
    onChange(new Date(Number(event.target.value), month, 1));
  };

  return (
    <Calendar
      mode="single"
      selected={value}
      onSelect={onChange}
      initialFocus
      captionLayout="dropdown"
      components={{
        Caption: () => (
          <div className="flex items-center gap-2 mb-2">
            <select
              value={month}
              onChange={handleMonthChange}
              className="border rounded-md p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {months.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={handleYearChange}
              className="border rounded-md p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )
      }}
    />
  );
};
