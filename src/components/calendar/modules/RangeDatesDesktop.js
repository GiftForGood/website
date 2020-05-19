import React, { useState } from 'react';
import DateTimeslot from './DateTimeslot';
import RangeButtonComponent from './RangeButtonComponent';
import { getMomentDateFromCalendarJSDate } from '../util/helpers';
import { Stack } from '@kiwicom/orbit-components/lib';

const getWeekIndex = (lastUpdatedDate, weeks) => {
  const startOfDate = lastUpdatedDate.startOf('day'); // reset to 12:00 am of lastUpdatedDate
  let weekIndex = 0;
  weeks.some((week, index) => {
    let weekContainsDate = week.some((day) => {
      const momentDate = getMomentDateFromCalendarJSDate(day);
      return momentDate.format() === startOfDate.format();
    });

    if (weekContainsDate) {
      weekIndex = index;
      return true;
    }
  });

  return weekIndex;
};

const RangeDatesDesktop = ({
  lastUpdatedDate,
  currentDateTime,
  weeks,
  updateLastUpdatedDate,
  timeslots,
  onTimeslotClick,
  selectedTimeslots,
  renderDays,
}) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(getWeekIndex(lastUpdatedDate, weeks));
  const currentWeek = weeks[currentWeekIndex];
  const startDateOfWeek = getMomentDateFromCalendarJSDate(currentWeek[0]);
  const endDateOfWeek = getMomentDateFromCalendarJSDate(currentWeek[currentWeek.length - 1]);
  const currentRangeTitle = `${startDateOfWeek.format('D MMM')} - ${endDateOfWeek.format('D MMM')}`;

  const validatePastDate = (date) => {
    if (date.isBefore(currentDateTime, 'day')) {
      updateLastUpdatedDate(currentDateTime);
    } else {
      updateLastUpdatedDate(date);
    }
  };

  const handlePrevWeekClick = () => {
    const prevWeekIndex = currentWeekIndex - 1;
    // if prevWeekIndex is second week onwards of the month
    if (prevWeekIndex > 0) {
      const firstDayOfPrevWeek = getMomentDateFromCalendarJSDate(weeks[prevWeekIndex][0]);
      validatePastDate(firstDayOfPrevWeek);
      // if prevWeekIndex is first week of the month
    } else if (prevWeekIndex == 0) {
      const firstDayOfPrevWeek = getMomentDateFromCalendarJSDate(weeks[0][0]);
      validatePastDate(firstDayOfPrevWeek);
      // else prevWeekIndex is the last week of the prev month
    } else {
      const firstDayOfPrevWeek = getMomentDateFromCalendarJSDate(weeks[0][0]).clone().subtract(7, 'days');
      validatePastDate(firstDayOfPrevWeek);
    }
  };

  const handleNextWeekClick = () => {
    const nextWeekIndex = currentWeekIndex + 1;
    // if nextWeekIndex is before the last week of month
    if (nextWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(nextWeekIndex);
      // else nextWeekIndex is last week of the month or onwards
    } else {
      const lastDay = weeks[currentWeekIndex].length - 1;
      const lastDayOfNextWeek = getMomentDateFromCalendarJSDate(weeks[currentWeekIndex][lastDay])
        .clone()
        .add(7, 'days');
      updateLastUpdatedDate(lastDayOfNextWeek);
    }
  };

  const RenderDateTimeslot = () => {
    const daysToRender = weeks[currentWeekIndex];
    return daysToRender.map((day, index) => {
      return (
        <DateTimeslot
          key={index}
          dayToRender={day}
          currentDateTime={currentDateTime}
          timeslots={timeslots}
          renderDays={renderDays}
          onTimeslotClick={onTimeslotClick}
          selectedTimeslots={selectedTimeslots}
        />
      );
    });
  };

  return (
    <div>
      <RangeButtonComponent
        title={currentRangeTitle}
        handlePrevClick={handlePrevWeekClick}
        handleNextClick={handleNextWeekClick}
      />
      <Stack direction="row" spaceAfter="medium">
        <RenderDateTimeslot />
      </Stack>
    </div>
  );
};

export default RangeDatesDesktop;
