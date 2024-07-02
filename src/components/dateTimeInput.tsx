import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import 'media/css/dateTimeInput.scss'; // Đừng quên import file CSS để styling
import helpers from 'helpers/index';
import dateandtime from 'date-and-time';

interface DateInputProps {
  onDateChange: (date: { day: string; month: string; year: string }) => void;
  label: string;
  /** Date, YYYY-MM-DD */
  initialDate?: string;
}

export default function DateTimeInput({ onDateChange, label, initialDate }: DateInputProps) {
  const initialDateObject = useRef<Date | null>(null);
  let isValidDate = helpers.isDate(initialDate);
  if (initialDate && isValidDate && !initialDateObject.current) {
    initialDateObject.current = new Date(initialDate);
  }

  const initialYear = initialDateObject.current ? initialDateObject.current.getFullYear().toString() : '';
  const initialMonth = initialDateObject.current ? (initialDateObject.current.getMonth() + 1).toString().padStart(2, '0') : '';
  const initialDay = initialDateObject.current ? initialDateObject.current.getDate().toString().padStart(2, '0') : '';

  const [day, setDay] = useState<string>(initialDay);
  const [month, setMonth] = useState<string>(initialMonth);
  const [year, setYear] = useState<string>(initialYear);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const startCallback = useRef(false);
  const handleFocus = useCallback(() => {
    startCallback.current = true;
  }, [startCallback.current]);

  const onChangeCallback = useMemo(() => helpers.debounce((_value) => onDateChange(_value), 500), []);

  useEffect(() => {
    // Kiểm tra nếu tất cả các giá trị ngày, tháng và năm đã được nhập, và không có trường nào được focus, thì gọi callback
    if (day && month && year && startCallback.current) {
      onChangeCallback({ day, month, year });
    }
  }, [day, month, year, startCallback]);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setDay(value);
      if (value.length === 2 && Number(value) > 0 && Number(value) <= 31) {
        monthRef.current?.focus();
      }
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setMonth(value);
      if (value.length === 2 && Number(value) > 0 && Number(value) <= 12) {
        yearRef.current?.focus();
      }
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setYear(value);
    }
  };

  return (
    <div className="date-input-container">
      <label>{label}</label>
      <div className="date-input">
        <input ref={dayRef} type="text" value={day} onChange={handleDayChange} onFocus={handleFocus} placeholder="DD" maxLength={2} />
        <span>/</span>
        <input ref={monthRef} type="text" value={month} onChange={handleMonthChange} onFocus={handleFocus} placeholder="MM" maxLength={2} />
        <span>/</span>
        <input ref={yearRef} type="text" value={year} onChange={handleYearChange} onFocus={handleFocus} placeholder="YYYY" maxLength={4} />
      </div>
    </div>
  );
}
