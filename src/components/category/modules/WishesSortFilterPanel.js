import React from 'react';
import { Stack, Collapse } from '@kiwicom/orbit-components/lib';
import WishesSortBy from '../modules/WishesSortBy';
import WishesFilterby from '../modules/WishesFilterBy';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { connectSortBy } from 'react-instantsearch-dom';

const WishesSort = connectSortBy(WishesSortBy);

const WishesSortFilterPanel = ({ sortItems, sortDefaultRefinement, category, onLatLngUpdated }) => {
  const { isDesktop } = useMediaQuery();

  return (
    <Stack>
      {isDesktop ? (
        <>
          <WishesSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
          <WishesFilterby onLatLngUpdated={onLatLngUpdated} />
        </>
      ) : (
        <Collapse label="Filter/Sort Settings">
          <Stack>
            <WishesSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
            <WishesFilterby onLatLngUpdated={onLatLngUpdated} />
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
};

export default WishesSortFilterPanel;
