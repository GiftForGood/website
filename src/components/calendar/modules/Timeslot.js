import React from 'react';
import { Button, Tag } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const SelectedButton = styled.button`
  background: #4db6ac;

  :hover {
    background: #35ada0;
  }

  :focus {
    box-shadow: 0 0 0 3px #16a595;
  }
`;

const unselectedButton = styled.button`
  background: white;

  box-shadow: 1px 1px 2px 2px #e7e7e7;

  :hover {
    background: #e7e7e7;
  }

  :focus {
    box-shadow: 1px 1px 2px 2px #e7e7e7;
  }
`;

const Timeslot = ({ ...props }) => {
  const handleSelect = () => {
    props.handleTimeslotClick();
  };

  if (props.isSelected) {
    return (
      <Button size="small" asComponent={SelectedButton} fullWidth="100%" onClick={handleSelect}>
        {props.description}
      </Button>
    );
  } else {
    return (
      <Button
        type="secondary"
        asComponent={unselectedButton}
        size="small"
        fullWidth="100%"
        onClick={handleSelect}
        disabled={props.isDisabled}
      >
        {props.description}
      </Button>
    );
  }
};

export default Timeslot;
