import React from 'react';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import { Button, Stack, Text } from '@kiwicom/orbit-components/lib';
import { ChevronLeft, ChevronRight } from '@kiwicom/orbit-components/lib/icons';

const circleButton = styled.button`
  background: ${colors.calendarUnselectedButton.background};

  box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedButton.hover};

  :hover {
    background: ${colors.calendarUnselectedButton.hover};
  }

  :focus {
    box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedButton.hover};
  }
`;

const RangeButtonComponent = ({ shouldHideButtons, title, handlePrevClick, handleNextClick }) => {
  return (
    <Stack direction="row" align="center" spacing="loose" justify="center" spaceAfter="normal">
      {!shouldHideButtons && (
        <Button
          circled
          iconLeft={<ChevronLeft />}
          size="small"
          title="Button"
          type="white"
          onClick={handlePrevClick}
          asComponent={circleButton}
        />
      )}
      <Text size="large">{title}</Text>
      {!shouldHideButtons && (
        <Button
          circled
          iconLeft={<ChevronRight />}
          size="small"
          title="Button"
          type="white"
          onClick={handleNextClick}
          asComponent={circleButton}
        />
      )}
    </Stack>
  );
};

export default RangeButtonComponent;
