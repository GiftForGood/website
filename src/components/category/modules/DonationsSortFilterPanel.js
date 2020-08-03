import React from 'react';
import { Stack, Collapse } from '@kiwicom/orbit-components/lib';
import DonationsSortBy from '../modules/DonationsSortBy';
import DonationsFilterBy from '../modules/DonationsFilterBy';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { connectSortBy } from 'react-instantsearch-dom';

const DonationsSort = connectSortBy(DonationsSortBy);

const DonationsSortFilterPanel = ({ sortItems, sortDefaultRefinement, category, onLatLngUpdated }) => {
  const { isDesktop } = useMediaQuery();

  return (
    <Stack>
      {isDesktop ? (
        <>
          <DonationsSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
          <DonationsFilterBy onLatLngUpdated={onLatLngUpdated} />
        </>
      ) : (
        <Collapse label="Filter/Sort Settings">
          <Stack>
            <DonationsSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
            <DonationsFilterBy onLatLngUpdated={onLatLngUpdated} />
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
};

export default DonationsSortFilterPanel;
