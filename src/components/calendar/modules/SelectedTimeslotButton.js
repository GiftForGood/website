import React from 'react';
import styled from 'styled-components';
import { Button } from '@kiwicom/orbit-components/lib';

const GreenButton = styled.button`
  background: #4db6ac;

  :hover {
    background: #35ada0;
  }

  :focus {
    box-shadow: 0 0 0 3px #16a595;
  }
`;

const SelectedTimeslotButton = ({ ...props }) => {
  const handleSelect = () => {
    props.handleTimeslotClick();
  };

  return (
    <Button size="small" asComponent={GreenButton} fullWidth="100%" onClick={handleSelect}>
      {props.description}
    </Button>
  );
};

export default SelectedTimeslotButton;
