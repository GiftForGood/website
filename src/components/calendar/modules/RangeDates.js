import React, { useState } from 'react';
import styled from 'styled-components';
import Week from './Week';

import { getMomentDateFromCalendarJSDate } from '../util/helpers';
import { Button, Stack, Text } from '@kiwicom/orbit-components/lib';
import { ChevronLeft, ChevronRight } from '@kiwicom/orbit-components/lib/icons';

const circleButton = styled.button`
  background: white;

  box-shadow: 1px 1px 2px 2px #e7e7e7;

  :hover {
    background: #e7e7e7;
  }

  :focus {
    box-shadow: 1px 1px 2px 2px #e7e7e7;
  }
`;

const getWeekIndex = (currentDate, weeks) => {
  const startOfDate = currentDate.startOf('day'); // reset to 12:00 am of currentDate

  let weekIndex = 0;
  weeks.some((week, index) => {
    let weekContainsDate = week.some((day) => {
      const momentDay = getMomentDateFromCalendarJSDate(day);
      return momentDay.format() === startOfDate.format();
    });

    if (weekContainsDate) {
      weekIndex = index;
    }
  });

  return weekIndex;
};

const RangeDates = ({ ...props }) => {
  const { currentDate, initialDate, weeks, onWeekOutOfMonth, timeslots, renderDays } = props;
  const [currentWeekIndex, setCurrentWeekIndex] = useState(getWeekIndex(currentDate, weeks));

  const RenderWeekTitle = () => {
    const currentWeek = weeks[currentWeekIndex];
    const startDateOfWeek = getMomentDateFromCalendarJSDate(currentWeek[0]);
    const endDateOfWeek = getMomentDateFromCalendarJSDate(currentWeek[currentWeek.length - 1]);
    const currentWeekTitle = `${startDateOfWeek.format('D MMM')} - ${endDateOfWeek.format('D MMM')}`;

    const handlePrevWeekClick = () => {
      if (currentWeekIndex - 1 > 0) {
        setCurrentWeekIndex(currentWeekIndex - 1);
      } else if (currentWeekIndex - 1 == 0) {
        const firstDayOfPrevWeek = getMomentDateFromCalendarJSDate(weeks[0][0]);
        onWeekOutOfMonth(firstDayOfPrevWeek);
      } else {
        const firstDayOfPrevWeek = getMomentDateFromCalendarJSDate(weeks[0][0]).clone().subtract(1, 'days');
        onWeekOutOfMonth(firstDayOfPrevWeek);
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
        onWeekOutOfMonth(firstDayOfNextWeek);
      }
    };

    return (
      <Stack direction="row" align="center" spacing="loose" justify="center" spaceAfter="normal">
        <Button
          circled
          iconLeft={<ChevronLeft />}
          size="small"
          title="Button"
          type="white"
          onClick={handlePrevWeekClick}
          asComponent={circleButton}
        />
        <Text size="large">{currentWeekTitle}</Text>
        <Button
          circled
          iconLeft={<ChevronRight />}
          size="small"
          title="Button"
          type="white"
          onClick={handleNextWeekClick}
          asComponent={circleButton}
        />
      </Stack>
    );
  };

  const RenderWeek = () => {
    return (
      <Week
        weekToRender={weeks[currentWeekIndex]}
        initialDate={initialDate}
        timeslots={timeslots}
        renderDays={renderDays}
        onTimeslotClick={props.onTimeslotClick}
        selectedTimeslots={props.selectedTimeslots}
        // timeslotProps={timeslotProps}
        // disabledTimeslots={disabledTimeslots}
      />
    );
  };

  return (
    <div>
      <RenderWeekTitle />
      <RenderWeek />
    </div>
  );
};

export default RangeDates;
