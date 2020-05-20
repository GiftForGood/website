import React from 'react';
import moment from 'moment';
import SelectedTimeslotButton from '../../buttons/SelectedTimeslotButton';
import TimeslotButton from '../../buttons/TimeslotButton';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { getMomentDateFromCalendarJSDate } from '../util/helpers';
import { Button, Stack, Text } from '@kiwicom/orbit-components/lib';

const DateTimeslot = ({ dayToRender, currentDateTime, timeslots, renderDays, onTimeslotClick, selectedTimeslots }) => {
  const { isTablet } = useMediaQuery();

  let momentDate = getMomentDateFromCalendarJSDate(dayToRender);
  const weekDay = momentDate.format('ddd').toUpperCase();

  if (renderDays[weekDay]) {
    const DateTitle = () => {
      return (
        <Text align="center" size="large">
          {momentDate.format('D MMM')}
          <br />
          {momentDate.format('(ddd)')}
        </Text>
      );
    };

    const Timeslots = () => {
      return timeslots.map((slot, index) => {
        let description = '';
        for (let i = 0; i < slot.length; i++) {
          description += moment(slot[i], 'h').format('h A');
          if (i < slot.length - 1) {
            description += ' - ';
          }
        }

        let timeslotDates = {
          startDate: momentDate.clone().add(slot[0], 'h'),
          endDate: momentDate.clone().add(slot[slot.length - 1], 'h'),
        };

        const isSelected = selectedTimeslots.some((selectedTimeslot) => {
          return timeslotDates.startDate.format() === selectedTimeslot.startDate.format();
        });

        let isDisabled = false;
        if (timeslotDates.startDate.isSameOrBefore(currentDateTime, 'hour')) {
          isDisabled = true;
        }

        if (isSelected) {
          return (
            <Button
              key={index}
              size="small"
              asComponent={SelectedTimeslotButton}
              fullWidth="100%"
              onClick={() => onSelect(index)}
            >
              {description}
            </Button>
          );
        } else {
          return (
            <Button
              key={index}
              type="secondary"
              asComponent={TimeslotButton}
              size="small"
              fullWidth="100%"
              onClick={() => onSelect(index)}
              disabled={isDisabled}
            >
              {description}
            </Button>
          );
        }
      });
    };

    const onSelect = (index) => {
      const timeslot = {
        startDate: momentDate.clone().add(timeslots[index][0], 'h'),
        endDate: momentDate.clone().add(timeslots[index][1], 'h'),
      };

      onTimeslotClick(timeslot);
    };

    return (
      <Stack direction="column" align="center" shrink="true">
        {isTablet ? <DateTitle /> : null}
        <Timeslots />
      </Stack>
    );
  }
};

export default DateTimeslot;
