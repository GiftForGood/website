import React, { useState } from 'react';
import DateTimeslot from './DateTimeslot';
import RangeButtonComponent from './RangeButtonComponent';
import { getMomentDateFromCalendarJSDate } from '../util/helpers';
import { Stack } from '@kiwicom/orbit-components/lib';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const getWeekIndex = (currentDate, weeks) => {
  const startOfDate = currentDate.startOf('day'); // reset to 12:00 am of currentDate
  let weekIndex = 0;
  weeks.some((week, index) => {
    let weekContainsDate = week.some((day) => {
      const momentDate = getMomentDateFromCalendarJSDate(day);
      return momentDate.format() === startOfDate.format();
    });

    if (weekContainsDate) {
      weekIndex = index;
    }
  });

  return weekIndex;
};

const RangeDates = ({ ...props }) => {
  const { isTablet } = useMediaQuery();
  const { currentDate, currentDateTime, weeks, updateCurrentDate, timeslots, renderDays } = props;

  const RenderDateDesktop = () => {
    const [currentWeekIndex, setCurrentWeekIndex] = useState(getWeekIndex(currentDate, weeks));
    const currentWeek = weeks[currentWeekIndex];
    const startDateOfWeek = getMomentDateFromCalendarJSDate(currentWeek[0]);
    const endDateOfWeek = getMomentDateFromCalendarJSDate(currentWeek[currentWeek.length - 1]);
    const currentRangeTitle = `${startDateOfWeek.format('D MMM')} - ${endDateOfWeek.format('D MMM')}`;

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
      <div>
        <RangeButtonComponent
          title={currentRangeTitle}
          handlePrevClick={handlePrevWeekClick}
          handleNextClick={handleNextWeekClick}
        />
        <Stack direction="row" spaceAfter="medium">
          <DateTimeslot
            dayToRender={weeks[currentWeekIndex]}
            currentDateTime={currentDateTime}
            timeslots={timeslots}
            renderDays={renderDays}
            onTimeslotClick={props.onTimeslotClick}
            selectedTimeslots={props.selectedTimeslots}
          />
        </Stack>
      </div>
    );
  };

  const RenderDateMobile = () => {
    const lastTimeslotDay = currentDate.clone().add(timeslots[timeslots.length - 1][1], 'h');
    if (lastTimeslotDay.isBefore(currentDateTime, 'minutes')) {
      updateCurrentDate(currentDate.clone().add(1, 'days'));
    }

    const currentDateTitle = `${currentDate.format('D MMM (ddd)')}`;
    const day = [{ year: currentDate.format('YYYY'), month: currentDate.format('MM'), date: currentDate.format('DD') }];

    const handlePrevDateClick = () => {
      updateCurrentDate(currentDate.clone().subtract(1, 'days'));
    };

    const handleNextDateClick = () => {
      updateCurrentDate(currentDate.clone().add(1, 'days'));
    };

    return (
      <div>
        <RangeButtonComponent
          title={currentDateTitle}
          handlePrevClick={handlePrevDateClick}
          handleNextClick={handleNextDateClick}
        />
        <Stack direction="column" spaceAfter="medium">
          <DateTimeslot
            dayToRender={day}
            currentDateTime={currentDateTime}
            timeslots={timeslots}
            renderDays={renderDays}
            onTimeslotClick={props.onTimeslotClick}
            selectedTimeslots={props.selectedTimeslots}
          />
        </Stack>
      </div>
    );
  };

  return <div>{isTablet ? <RenderDateDesktop /> : <RenderDateMobile />}</div>;
};

export default RangeDates;
