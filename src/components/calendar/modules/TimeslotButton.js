import React from 'react';
import styled from 'styled-components';
import { Button } from '@kiwicom/orbit-components/lib';

const WhiteButton = styled.button`
  background: white;

  box-shadow: 1px 1px 2px 2px #e7e7e7;

  :hover {
    background: #e7e7e7;
  }

  :focus {
    box-shadow: 1px 1px 2px 2px #e7e7e7;
  }
`;

const TimeslotButton = ({ ...props }) => {
  const handleSelect = () => {
    props.handleTimeslotClick();
  };

  return (
    <Button
      type="secondary"
      asComponent={WhiteButton}
      size="small"
      fullWidth="100%"
      onClick={handleSelect}
      disabled={props.isDisabled}
    >
      {props.description}
    </Button>
  );
};

export default TimeslotButton;
