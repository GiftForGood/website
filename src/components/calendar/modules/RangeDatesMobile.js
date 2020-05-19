import React from 'react';
import DateTimeslot from './DateTimeslot';
import RangeButtonComponent from './RangeButtonComponent';
import { Stack } from '@kiwicom/orbit-components/lib';

const RangeDatesMobile = ({
  lastUpdatedDate,
  currentDateTime,
  updateLastUpdatedDate,
  timeslots,
  onTimeslotClick,
  selectedTimeslots,
  renderDays,
}) => {
  const lastTimeslotDay = lastUpdatedDate.clone().add(timeslots[timeslots.length - 1][1], 'h');
  if (lastTimeslotDay.isBefore(currentDateTime, 'minutes')) {
    updateLastUpdatedDate(lastUpdatedDate.clone().add(1, 'days'));
  }

  const currentDateTitle = `${lastUpdatedDate.format('D MMM (ddd)')}`;
  const day = {
    year: lastUpdatedDate.format('YYYY'),
    month: lastUpdatedDate.format('MM'),
    date: lastUpdatedDate.format('DD'),
  };

  const handlePrevDateClick = () => {
    updateLastUpdatedDate(lastUpdatedDate.clone().subtract(1, 'days'));
  };

  const handleNextDateClick = () => {
    updateLastUpdatedDate(lastUpdatedDate.clone().add(1, 'days'));
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
          onTimeslotClick={onTimeslotClick}
          selectedTimeslots={selectedTimeslots}
        />
      </Stack>
    </div>
  );
};

export default RangeDatesMobile;
