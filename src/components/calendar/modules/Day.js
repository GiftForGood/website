import React from 'react';
import moment from 'moment';
import Timeslot from './Timeslot';

import { Stack, Text } from '@kiwicom/orbit-components/lib';

const Day = ({ ...props }) => {
  const RenderWeekdayTitle = () => {
    return (
      <Text align="center" size="large">
        {props.date.format('D MMM')}
        <br />
        {props.date.format('(ddd)')}
      </Text>
    );
  };

  const RenderTimeslots = () => {
    return props.timeslots.map((slot, index) => {
      let description = '';
      for (let i = 0; i < slot.length; i++) {
        description += moment(slot[i], 'h').format('h A');
        if (i < slot.length - 1) {
          description += ' - ';
        }
      }

      let timeslotDates = {
        startDate: props.date.clone().add(slot[0], 'h'),
        endDate: props.date.clone().add(slot[slot.length - 1], 'h'),
      };

      const isSelected = props.selectedTimeslots.some((selectedTimeslot) => {
        return timeslotDates.startDate.format() === selectedTimeslot.startDate.format();
      });

      let isDisabled = false;
      if (timeslotDates.startDate.isSameOrBefore(props.initialDate, 'hour')) {
        isDisabled = true;
      }

      return (
        <Timeslot
          key={index}
          description={description}
          handleTimeslotClick={onSelect.bind(this, index)}
          isSelected={isSelected}
          isDisabled={isDisabled}
        />
      );
    });
  };

  const onSelect = (index) => {
    const startDateTime = props.date.clone().add(props.timeslots[index][0], 'h');
    const endDateTime = props.date.clone().add(props.timeslots[index][1], 'h');
    const selectedTimeslot = startDateTime.format('D MMM h A') + ' - ' + endDateTime.format('h A');

    const timeslot = {
      startDate: props.date.clone().add(props.timeslots[index][0], 'h'),
      endDate: props.date.clone().add(props.timeslots[index][1], 'h'),
    };

    props.onTimeslotClick(timeslot);
  };

  return (
    <Stack direction="column" align="center" shrink="true">
      <RenderWeekdayTitle />
      <RenderTimeslots />
    </Stack>
  );
};

export default Day;
