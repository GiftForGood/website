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

const RangeButtonComponent = ({ ...props }) => {
  return (
    <Stack direction="row" align="center" spacing="loose" justify="center" spaceAfter="normal">
      <Button
        circled
        iconLeft={<ChevronLeft />}
        size="small"
        title="Button"
        type="white"
        onClick={props.handlePrevClick}
        asComponent={circleButton}
      />
      <Text size="large">{props.title}</Text>
      <Button
        circled
        iconLeft={<ChevronRight />}
        size="small"
        title="Button"
        type="white"
        onClick={props.handleNextClick}
        asComponent={circleButton}
      />
    </Stack>
  );
};

export default RangeButtonComponent;
