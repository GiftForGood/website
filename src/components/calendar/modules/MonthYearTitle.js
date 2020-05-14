import React from 'react';
import styled from 'styled-components';
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

const MonthYearTitle = ({ ...props }) => {
  const monthYearFormat = 'MMMM - YYYY';
  const { initialDate, currentDate, updateCurrentDate } = props;
  const currentMonthYear = `${currentDate.format(monthYearFormat)}`;

  const handlePrevMonthClick = () => {
    let prevMonth = currentDate.clone().startOf('month').subtract(1, 'months');

    if (prevMonth.isSame(initialDate, 'month')) {
      updateCurrentDate(initialDate);
    }

    if (prevMonth.isBefore(initialDate)) {
      return;
    }

    updateCurrentDate(prevMonth);
  };

  const handleNextMonthClick = () => {
    let nextMonth = currentDate.clone().startOf('month').add(1, 'months');
    updateCurrentDate(nextMonth);
  };

  const RenderMonthYearTitle = () => {
    return (
      <Stack direction="row" align="center" spacing="loose" justify="center" spaceAfter="normal">
        <Button
          circled
          iconLeft={<ChevronLeft />}
          size="small"
          title="Button"
          type="white"
          onClick={handlePrevMonthClick}
          asComponent={circleButton}
        />
        <Text size="large">{currentMonthYear}</Text>
        <Button
          circled
          iconLeft={<ChevronRight />}
          size="small"
          title="Button"
          type="white"
          onClick={handleNextMonthClick}
          asComponent={circleButton}
        />
      </Stack>
    );
  };

  return <RenderMonthYearTitle />;
};

export default MonthYearTitle;
