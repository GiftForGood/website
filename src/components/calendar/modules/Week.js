import React from 'react';
import Day from './Day';

import { getMomentDateFromCalendarJSDate } from '../util/helpers';
import { Stack } from '@kiwicom/orbit-components/lib';

const Week = ({ ...props }) => {
  const RenderWeekdays = () => {
    return props.weekToRender.map((day, index) => {
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
            // timeslotProps={timeslotProps}
            // disabledTimeslots={disabledTimeslots}
          />
        );
      }
    });
  };

  return (
    <Stack desktop={{ direction: 'row' }} tablet={{ direction: 'row' }} direction="column" spaceAfter="medium">
      <RenderWeekdays />
    </Stack>
  );
};

export default Week;
