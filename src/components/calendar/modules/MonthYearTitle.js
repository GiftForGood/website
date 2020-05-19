import React from 'react';
import RangeButtonComponent from './RangeButtonComponent';

const MonthYearTitle = ({ currentDateTime, lastUpdatedDate, updateLastUpdatedDate }) => {
  const monthYearFormat = 'MMMM YYYY';
  const currentMonthYear = `${lastUpdatedDate.format(monthYearFormat)}`;

  const handlePrevMonthClick = () => {
    let prevMonth = lastUpdatedDate.clone().startOf('month').subtract(1, 'months');

    if (prevMonth.isBefore(currentDateTime)) {
      return;
    }
    if (prevMonth.isSame(currentDateTime, 'month')) {
      updateLastUpdatedDate(currentDateTime);
    } else {
      updateLastUpdatedDate(prevMonth);
    }
  };

  const handleNextMonthClick = () => {
    let nextMonth = lastUpdatedDate.clone().startOf('month').add(1, 'months');
    updateLastUpdatedDate(nextMonth);
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
