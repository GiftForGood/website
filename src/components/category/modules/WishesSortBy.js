import React from 'react';
import { ChoiceGroup, Radio, Separator } from '@kiwicom/orbit-components/lib';
import BlackText from '../../text/BlackText';

/**
 * https://www.algolia.com/doc/api-reference/widgets/sort-by/react/#create-a-react-component
 * @param {object[]} items
 * @param {string} currentRefinement
 * @param {function} refine
 */
const WishesSortBy = ({ items, currentRefinement, refine }) => {
  const handleSelect = (event) => {
    const sortBy = event.target.value;
    refine(sortBy);
  };

  return (
    <>
      <BlackText style={{ marginBottom: '10px' }} size="large">
        Sort By
      </BlackText>
      <Separator />
      <ChoiceGroup style={{ flexDirection: 'row' }} onChange={(event) => handleSelect(event)}>
        {items.map((item) => {
          return <Radio label={item.label} checked={currentRefinement === item.value} value={item.value} />;
        })}
      </ChoiceGroup>
    </>
  );
};

export default WishesSortBy;
