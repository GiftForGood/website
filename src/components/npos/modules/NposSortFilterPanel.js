import React from 'react';
import { Stack, Collapse } from '@kiwicom/orbit-components/lib';
import NposSortBy from '../modules/NposSortBy';
import NposFilterBy from '../modules/NposFilterBy';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { connectSortBy } from 'react-instantsearch-dom';

const NposSort = connectSortBy(NposSortBy);

const NposSortFilterPanel = ({ sortItems, sortDefaultRefinement }) => {
  const { isDesktop } = useMediaQuery();

  return (
    <Stack>
      {isDesktop ? (
        <>
          <NposSort items={sortItems} defaultRefinement={sortDefaultRefinement} />
          <NposFilterBy />
        </>
      ) : (
        <Collapse label="Filter/Sort Settings">
          <Stack>
            <NposSort items={sortItems} defaultRefinement={sortDefaultRefinement} />
            <NposFilterBy />
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
};

export default NposSortFilterPanel;
