import React from 'react';
import RangeButtonComponent from './RangeButtonComponent';

const MonthYearTitle = ({ ...props }) => {
  const monthYearFormat = 'MMMM - YYYY';
  const { currentDateTime, currentDate, updateCurrentDate } = props;
  const currentMonthYear = `${currentDate.format(monthYearFormat)}`;

  const handlePrevMonthClick = () => {
    let prevMonth = currentDate.clone().startOf('month').subtract(1, 'months');

    if (prevMonth.isSame(currentDateTime, 'month')) {
      updateCurrentDate(currentDateTime);
    }

    if (prevMonth.isBefore(currentDateTime)) {
      return;
    }

    updateCurrentDate(prevMonth);
  };

  const handleNextMonthClick = () => {
    let nextMonth = currentDate.clone().startOf('month').add(1, 'months');
    updateCurrentDate(nextMonth);
  };

  return (
    <RangeButtonComponent
      title={currentMonthYear}
      handlePrevClick={handlePrevMonthClick}
      handleNextClick={handleNextMonthClick}
    />
  );
};

export default MonthYearTitle;
