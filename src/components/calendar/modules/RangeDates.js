import React, { useState } from 'react';
import Week from './Week';
import RangeButtonComponent from './RangeButtonComponent';
import { getMomentDateFromCalendarJSDate } from '../util/helpers';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const getWeekIndex = (currentDate, weeks) => {
  let weekIndex = 0;
  weeks.some((week, index) => {
    let weekContainsDate = week.some((day) => {
      const momentDate = getMomentDateFromCalendarJSDate(day);
      return momentDate.format() === currentDate.format();
    });

    if (weekContainsDate) {
      weekIndex = index;
    }
  });

  return weekIndex;
};

const RangeDates = ({ ...props }) => {
  const { isTablet } = useMediaQuery();

  const { currentDate, initialDate, weeks, updateCurrentDate, timeslots, renderDays } = props;
  const [currentWeekIndex, setCurrentWeekIndex] = useState(getWeekIndex(currentDate, weeks));

  const RenderWeekTitleDesktop = () => {
    const currentWeek = weeks[currentWeekIndex];
    const startDateOfWeek = getMomentDateFromCalendarJSDate(currentWeek[0]);
    const endDateOfWeek = getMomentDateFromCalendarJSDate(currentWeek[currentWeek.length - 1]);
    const currentWeekTitle = `${startDateOfWeek.format('D MMM')} - ${endDateOfWeek.format('D MMM')}`;

    const handlePrevWeekClick = () => {
      if (currentWeekIndex - 1 > 0) {
        setCurrentWeekIndex(currentWeekIndex - 1);
      } else if (currentWeekIndex - 1 == 0) {
        const firstDayOfPrevWeek = getMomentDateFromCalendarJSDate(weeks[0][0]);
        updateCurrentDate(firstDayOfPrevWeek);
      } else {
        const firstDayOfPrevWeek = getMomentDateFromCalendarJSDate(weeks[0][0]).clone().subtract(1, 'days');
        updateCurrentDate(firstDayOfPrevWeek);
      }
    };

    const handleNextWeekClick = () => {
      if (currentWeekIndex + 1 < weeks.length - 1) {
        setCurrentWeekIndex(currentWeekIndex + 1);
      } else {
        const lastDay = weeks[currentWeekIndex].length - 1;
        const firstDayOfNextWeek = getMomentDateFromCalendarJSDate(weeks[currentWeekIndex][lastDay])
          .clone()
          .add(7, 'days');
        updateCurrentDate(firstDayOfNextWeek);
      }
    };

    return (
      <RangeButtonComponent
        title={currentWeekTitle}
        handlePrevClick={handlePrevWeekClick}
        handleNextClick={handleNextWeekClick}
      />
    );
  };

  const RenderWeekDesktop = () => {
    return (
      <Week
        daysToRender={weeks[currentWeekIndex]}
        initialDate={initialDate}
        timeslots={timeslots}
        renderDays={renderDays}
        onTimeslotClick={props.onTimeslotClick}
        selectedTimeslots={props.selectedTimeslots}
      />
    );
  };

  const RenderDayTitleMobile = () => {
    const currentDayTitle = `${currentDate.format('D MMM (ddd)')}`;

    const handlePrevDayClick = () => {
      updateCurrentDate(currentDate.clone().subtract(1, 'days'));
    };

    const handleNextDayClick = () => {
      updateCurrentDate(currentDate.clone().add(1, 'days'));
    };

    return (
      <RangeButtonComponent
        title={currentDayTitle}
        handlePrevClick={handlePrevDayClick}
        handleNextClick={handleNextDayClick}
      />
    );
  };

  const RenderDayMobile = () => {
    const day = [{ year: currentDate.format('YYYY'), month: currentDate.format('MM'), date: currentDate.format('DD') }];
    return (
      <Week
        daysToRender={day}
        initialDate={initialDate}
        timeslots={timeslots}
        renderDays={renderDays}
        onTimeslotClick={props.onTimeslotClick}
        selectedTimeslots={props.selectedTimeslots}
      />
    );
  };

  return (
    <div>
      {isTablet ? <RenderWeekTitleDesktop /> : <RenderDayTitleMobile />}
      {isTablet ? <RenderWeekDesktop /> : <RenderDayMobile />}
    </div>
  );
};

export default RangeDates;
