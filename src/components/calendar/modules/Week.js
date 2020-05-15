import React from 'react';
import Day from './Day';
import { getMomentDateFromCalendarJSDate } from '../util/helpers';
import { Stack } from '@kiwicom/orbit-components/lib';

const Week = ({ ...props }) => {
  const RenderDays = () => {
    return props.daysToRender.map((day, index) => {
      let momentDate = getMomentDateFromCalendarJSDate(day);
      const weekDay = momentDate.format('ddd').toUpperCase();
      if (props.renderDays[weekDay]) {
        return (
          <Day
            key={index}
            date={momentDate}
            initialDate={props.initialDate}
            timeslots={props.timeslots}
            onTimeslotClick={props.onTimeslotClick}
            selectedTimeslots={props.selectedTimeslots}
          />
        );
      }
    });
  };

  return (
    <Stack desktop={{ direction: 'row' }} tablet={{ direction: 'row' }} direction="column" spaceAfter="medium">
      <RenderDays />
    </Stack>
  );
};

export default Week;
