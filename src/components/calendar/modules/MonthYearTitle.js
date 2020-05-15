import React from 'react';
import RangeButtonComponent from './RangeButtonComponent';

const MonthYearTitle = ({ ...props }) => {
  const monthYearFormat = 'MMMM - YYYY';
  const { initialDate, currentDate, updateCurrentDate } = props;
  const currentMonthYear = `${currentDate.format(monthYearFormat)}`;

  const handlePrevMonthClick = () => {
    let prevMonth = currentDate.clone().startOf('month').subtract(1, 'months');

    if (prevMonth.isSame(initialDate, 'month')) {
      updateCurrentDate(initialDate);
    }

    if (prevMonth.isBefore(initialDate)) {
      return;
    }

    updateCurrentDate(prevMonth);
  };

  const handleNextMonthClick = () => {
    let nextMonth = currentDate.clone().startOf('month').add(1, 'months');
    updateCurrentDate(nextMonth);
  };

  const RenderMonthYearTitle = () => {
    return (
      <RangeButtonComponent
        title={currentMonthYear}
        handlePrevClick={handlePrevMonthClick}
        handleNextClick={handleNextMonthClick}
      />
    );
  };

  return <RenderMonthYearTitle />;
};

export default MonthYearTitle;
