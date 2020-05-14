import React from 'react';
import { Tag } from '@kiwicom/orbit-components/lib';

const DisplaySelectedDate = ({ ...props }) => {
  const handleClick = () => {
    props.handleClick();
  };
  return (
    <Tag selected={true} onRemove={handleClick} size="small">
      {props.slot}
    </Tag>
  );
};

export default DisplaySelectedDate;
