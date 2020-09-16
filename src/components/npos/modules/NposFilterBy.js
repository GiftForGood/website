import React from 'react';
import { Button, InputField, Stack, Separator } from '@kiwicom/orbit-components/lib';
import BlackText from '@components/text/BlackText';

const NposFilterBy = ({}) => {
  return (
    <div>
      <BlackText style={{ marginBottom: '10px' }} size="large">
        Filter By
      </BlackText>
      <Separator />
    </div>
  );
};

export default NposFilterBy;
