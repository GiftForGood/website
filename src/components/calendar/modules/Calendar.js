import React, { useState } from 'react';
import CalendarJS from 'calendarjs';
import moment from 'moment';
import MonthYearTitle from './MonthYearTitle';
import RangeDates from './RangeDates';
import { RENDER_DAYS } from '../constants/week';
import { Stack, Tag, Text } from '@kiwicom/orbit-components/lib';

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
  const timeslots = generateTimeslots(props.timeslot.startTime, props.timeslot.endTime, props.timeslot.interval);

  const currentDateTime = moment();
  const [currentDate, setCurrentDate] = useState(moment().startOf('day'));
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const hasTimeslot = selectedTimeslots.length == 0;

  const updateCurrentDate = (date) => {
    setCurrentDate(date);
  };

  const RenderRangeDates = () => {
    const cal = new CalendarJS(currentDate.year(), currentDate.month() + 1);
    const weeks = cal.generate();

    return (
      <RangeDates
        currentDate={currentDate}
        currentDateTime={currentDateTime}
        weeks={weeks}
        updateCurrentDate={updateCurrentDate}
        timeslots={timeslots}
        onTimeslotClick={handleTimeslotClick}
        selectedTimeslots={selectedTimeslots}
        renderDays={props.renderDays}
      />
    );
  };

  const handleTimeslotClick = (newTimeslot) => {
    const newSelectedTimeslots = selectedTimeslots.slice();
    let timeslotIndex = -1;
    const isTimeslotExists = newSelectedTimeslots.some((timeslot, index) => {
      timeslotIndex = index;
      return newTimeslot.startDate.format() === timeslot.startDate.format();
    });

    if (isTimeslotExists) {
      newSelectedTimeslots.splice(timeslotIndex, 1);
    } else if (selectedTimeslots.length + 1 <= props.maxSlots && newTimeslot.startDate.isAfter(currentDateTime)) {
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

  const DisplaySelectedSlot = () => {
    return selectedTimeslots.map((timeslot, index) => {
      const timeslotDescription =
        timeslot.startDate.format('D MMM (ddd), h A') + ' - ' + timeslot.endDate.format('h A');
      return (
        <Tag key={index} selected={true} onRemove={removeKeyByIndex.bind(this, index)} size="small">
          {timeslotDescription}
        </Tag>
      );
    });
  };

  return (
    <div>
      <MonthYearTitle
        currentDateTime={currentDateTime}
        currentDate={currentDate}
        updateCurrentDate={updateCurrentDate}
      />
      <RenderRangeDates />
      <Stack spaceAfter="small">
        <Text weight="bold" size="large">
          My Selected Timeslots:
        </Text>
        {hasTimeslot ? <Text>Please select a timeslot from the above</Text> : ''}
      </Stack>
      <Stack
        desktop={{ direction: 'row' }}
        tablet={{ direction: 'row' }}
        direction="column"
        align="start"
        spacing="compact"
      >
        <DisplaySelectedSlot />
      </Stack>
    </div>
  );
};

export default Calendar;
