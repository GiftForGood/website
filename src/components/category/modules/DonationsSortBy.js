import React, { useEffect } from 'react';
import { ChoiceGroup, Radio, Separator } from '@kiwicom/orbit-components/lib';
import BlackText from '../../text/BlackText';
import { useRouter } from 'next/router';

/**
 * https://www.algolia.com/doc/api-reference/widgets/sort-by/react/#create-a-react-component
 * @param {object[]} items
 * @param {string} currentRefinement
 * @param {function} refine
 */
const DonationsSortBy = ({ items, currentRefinement, refine, sortByIndex, category }) => {
  const router = useRouter();

  const handleSelect = (event) => {
    const sortBy = event.target.value;
    refine(sortBy);
    if (category) {
      router.push(
        `/donations/category/[categoryId]`,
        `/donations/category/${category.id}?sortBy=${event.target.value}`,
        {
          shallow: true,
        }
      );
    } else {
      // for view all donations
      router.push(`/donations/category`, `/donations/category?sortBy=${event.target.value}`, {
        shallow: true,
      });
    }
  };

  return (
    <>
      <BlackText style={{ marginBottom: '10px' }} size="large">
        Sort By
      </BlackText>
      <Separator />
      <ChoiceGroup style={{ flexDirection: 'row' }} onChange={(event) => handleSelect(event)}>
        {items.map((item) => {
          return <Radio label={item.label} checked={currentRefinement === item.value} value={item.value} key={item.value}/>;
        })}
      </ChoiceGroup>
    </>
  );
};

export default DonationsSortBy;
