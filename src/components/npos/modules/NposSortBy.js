import React, { useEffect } from 'react';
import { ChoiceGroup, Radio, Separator, Stack } from '@kiwicom/orbit-components/lib';
import BlackText from '@components/text/BlackText';
import { useRouter } from 'next/router';

/**
 * https://www.algolia.com/doc/api-reference/widgets/sort-by/react/#create-a-react-component
 * @param {object[]} items
 * @param {string} currentRefinement
 * @param {function} refine
 */
const NposSortBy = ({ items, currentRefinement, refine, sortByIndex }) => {
  const router = useRouter();

  const handleSelect = (event) => {
    const sortBy = event.target.value;
    refine(sortBy);
    router.push(`/npos`, `/npos?sortBy=${event.target.value}`, {
      shallow: true,
    });
  };

  return (
    <div>
      <BlackText style={{ marginBottom: '10px' }} size="large">
        Sort By
      </BlackText>
      <Separator />
      <ChoiceGroup style={{ flexDirection: 'row' }} onChange={(event) => handleSelect(event)}>
        {items.map((item, index) => {
          return (
            <Radio label={item.label} checked={currentRefinement === item.value} value={item.value} key={item.value} />
          );
        })}
      </ChoiceGroup>
    </div>
  );
};

export default NposSortBy;
