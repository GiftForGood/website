import React, { useState } from 'react';
import CalendarJS from 'calendarjs';
import moment from 'moment';

import MonthYearTitle from './MonthYearTitle';
import RangeDates from './RangeDates';
import DisplaySelectedDates from './DisplaySelectedDates';
import { RENDER_DAYS } from '../constants/week';

import { Text, Stack } from '@kiwicom/orbit-components/lib';

const updateRenderDays = (renderDays) => {
  renderDays = Object.assign({}, RENDER_DAYS, renderDays);
  return renderDays;
};

const generateTimeslots = (startTime, endTime, interval) => {
  let i = startTime;
  let slots = [];
  for (i; i + interval <= endTime; i = i + interval) {
    slots.push([`${i}`, `${i + interval}`]);
  }
  return slots;
};

const Calendar = ({ ...props }) => {
  props.renderDays = updateRenderDays(props.renderDays);
  const timeslot = generateTimeslots(props.timeslot.startTime, props.timeslot.endTime, props.timeslot.interval);

  const initialDate = moment();
  const [currentDate, setCurrentDate] = useState(moment().startOf('day'));
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);

  const updateCurrentDate = (currentDate) => {
    setCurrentDate(currentDate);
  };

  const RenderRangeDates = () => {
    const cal = new CalendarJS(currentDate.year(), currentDate.month() + 1);
    const weeks = cal.generate();

    return (
      <RangeDates
        currentDate={currentDate}
        initialDate={initialDate}
        weeks={weeks}
        updateCurrentDate={updateCurrentDate}
        timeslots={timeslot}
        onTimeslotClick={handleTimeslotSelect}
        selectedTimeslots={selectedTimeslots}
        renderDays={props.renderDays}
      />
    );
  };

  const handleTimeslotSelect = (newTimeslot) => {
    const newSelectedTimeslots = selectedTimeslots.slice();
    let timeslotIndex = -1;
    const isTimeslotExists = newSelectedTimeslots.some((timeslot, index) => {
      timeslotIndex = index;
      return newTimeslot.startDate.format() === timeslot.startDate.format();
    });

    if (isTimeslotExists) {
      newSelectedTimeslots.splice(timeslotIndex, 1);
    } else if (selectedTimeslots.length + 1 <= props.maxSlots && newTimeslot.startDate.isAfter(initialDate)) {
      newSelectedTimeslots.push(newTimeslot);
    } else {
      return;
    }

    setCurrentDate(moment(newTimeslot.startDate));
    setSelectedTimeslots(newSelectedTimeslots);
  };

  const removeKeyByIndex = (index) => {
    const newSelectedTimeslots = selectedTimeslots.slice();
    newSelectedTimeslots.splice(index, 1);
    setSelectedTimeslots(newSelectedTimeslots);
  };

  const RenderDisplaySlot = () => {
    return selectedTimeslots.map((slot, index) => {
      const displayTimeslot = slot.startDate.format('D MMM h A') + ' - ' + slot.endDate.format('h A');
      return (
        <DisplaySelectedDates key={index} slot={displayTimeslot} handleClick={removeKeyByIndex.bind(this, index)} />
      );
    });
  };

  return (
    <div>
      <MonthYearTitle initialDate={initialDate} currentDate={currentDate} updateCurrentDate={updateCurrentDate} />
      <RenderRangeDates />
      <Stack spaceAfter="small">
        <Text weight="bold" size="large">
          My Selected Timeslots:
        </Text>
      </Stack>
      <Stack
        desktop={{ direction: 'row' }}
        tablet={{ direction: 'row', align: 'center' }}
        direction="column"
        align="center"
      >
        <RenderDisplaySlot />
      </Stack>
    </div>
  );
};

export default Calendar;
