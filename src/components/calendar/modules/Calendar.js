import React, { useState } from 'react';
import CalendarJS from 'calendarjs';
import moment from 'moment';
import MonthYearTitle from './MonthYearTitle';
import RangeDatesDesktop from './RangeDatesDesktop';
import RangeDatesMobile from './RangeDatesMobile';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { RENDER_DAYS } from '@constants/week';
import { Stack, Tag, Text, Heading } from '@kiwicom/orbit-components/lib';

// overwrite the default days to render based on the props renderDays
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

const Calendar = ({ timeslot, maxSlots, renderDays, updateSelectedDates }) => {
  const { isTablet } = useMediaQuery();

  renderDays = updateRenderDays(renderDays);
  const timeslots = generateTimeslots(timeslot.startTime, timeslot.endTime, timeslot.interval);

  const currentDateTime = moment();
  const [lastUpdatedDate, setLastUpdatedDate] = useState(moment().startOf('day')); // to keep track of the date that user is currently on
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const hasNotSelectedAnyTimeslot = selectedTimeslots.length == 0;

  const updateLastUpdatedDate = (date) => {
    setLastUpdatedDate(date);
  };

  const RenderRangeDatesDesktop = () => {
    const cal = new CalendarJS(lastUpdatedDate.year(), lastUpdatedDate.month() + 1);
    const weeks = cal.generate();
    return (
      <RangeDatesDesktop
        lastUpdatedDate={lastUpdatedDate}
        currentDateTime={currentDateTime}
        weeks={weeks}
        updateLastUpdatedDate={updateLastUpdatedDate}
        timeslots={timeslots}
        onTimeslotClick={handleTimeslotClick}
        selectedTimeslots={selectedTimeslots}
        renderDays={renderDays}
      />
    );
  };

  const RenderRangeDatesMobile = () => {
    return (
      <RangeDatesMobile
        lastUpdatedDate={lastUpdatedDate}
        currentDateTime={currentDateTime}
        updateLastUpdatedDate={updateLastUpdatedDate}
        timeslots={timeslots}
        onTimeslotClick={handleTimeslotClick}
        selectedTimeslots={selectedTimeslots}
        renderDays={renderDays}
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
      newSelectedTimeslots.splice(timeslotIndex, 1); // remove timeslot if clicking on a timeslot that already exists
    } else if (selectedTimeslots.length + 1 <= maxSlots && newTimeslot.startDate.isAfter(currentDateTime)) {
      newSelectedTimeslots.push(newTimeslot);
    } else {
      return;
    }

    setLastUpdatedDate(moment(newTimeslot.startDate));
    setSelectedTimeslots(newSelectedTimeslots);
    updateSelectedDates(newSelectedTimeslots);
  };

  const removeKeyByIndex = (index) => {
    const newSelectedTimeslots = selectedTimeslots.slice();
    newSelectedTimeslots.splice(index, 1);
    setSelectedTimeslots(newSelectedTimeslots);
    updateSelectedDates(newSelectedTimeslots);
  };

  const DisplaySelectedSlot = () => {
    return selectedTimeslots.map((timeslot, index) => {
      const timeslotDescription =
        timeslot.startDate.format('D MMM (ddd), h A') + ' - ' + timeslot.endDate.format('h A');
      return (
        <Tag key={index} selected={true} onRemove={() => removeKeyByIndex(index)} size="small">
          {timeslotDescription}
        </Tag>
      );
    });
  };

  return (
    <div>
      <MonthYearTitle
        currentDateTime={currentDateTime}
        lastUpdatedDate={lastUpdatedDate}
        updateLastUpdatedDate={updateLastUpdatedDate}
      />
      {isTablet ? <RenderRangeDatesDesktop /> : <RenderRangeDatesMobile />}
      <Stack spaceAfter="small" justify="end">
        <Heading type="title5">{`*Please select up to ${maxSlots} dates`}</Heading>
      </Stack>
      <Stack spaceAfter="small">
        <Text weight="bold" size="large">
          My Selected Timeslots:
        </Text>
        {hasNotSelectedAnyTimeslot ? <Text>Please select a timeslot from the above</Text> : null}
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
