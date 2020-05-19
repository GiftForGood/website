import React from 'react';
import RangeButtonComponent from './RangeButtonComponent';

const MonthYearTitle = ({ currentDateTime, currentDate, updateCurrentDate }) => {
  const monthYearFormat = 'MMMM YYYY';
  const currentMonthYear = `${currentDate.format(monthYearFormat)}`;

  const handlePrevMonthClick = () => {
    let prevMonth = currentDate.clone().startOf('month').subtract(1, 'months');

    if (prevMonth.isBefore(currentDateTime)) {
      return;
    }
    if (prevMonth.isSame(currentDateTime, 'month')) {
      updateCurrentDate(currentDateTime);
    } else {
      updateCurrentDate(prevMonth);
    }
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
      shouldHideButtons={true}
    />
  );
};

export default MonthYearTitle;
