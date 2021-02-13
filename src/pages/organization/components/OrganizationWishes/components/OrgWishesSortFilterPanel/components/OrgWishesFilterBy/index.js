import React from 'react';

// components
import { Stack, Separator, Checkbox } from '@kiwicom/orbit-components/lib';
import BlackText from '@components/text/BlackText';

const OrgWishesFilterBy = ({ items, currentRefinement, refine }) => {
  return (
    <div>
      <BlackText style={{ marginBottom: '10px' }} size="large">
        Filter By
      </BlackText>
      <Separator />

      <Stack>
        {items.map((item, index) => {
          return (
            <Checkbox
              label={item.label + ' (' + item.count + ') '}
              value={item.value}
              checked={item.isRefined}
              key={item.value}
              onChange={() => {
                refine(item.value);
              }}
            />
          );
        })}
      </Stack>
    </div>
  );
};

export default OrgWishesFilterBy;
