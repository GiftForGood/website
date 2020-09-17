import React from 'react';
import { Stack, Collapse } from '@kiwicom/orbit-components/lib';
import NposSortBy from '../modules/NposSortBy';
import NposFilterBy from '../modules/NposFilterBy';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { connectSortBy, connectRefinementList } from 'react-instantsearch-dom';

const NposSort = connectSortBy(NposSortBy);
const NposFilter = connectRefinementList(NposFilterBy);

const NposSortFilterPanel = ({ sortItems, sortDefaultRefinement, query }) => {
  const { isDesktop } = useMediaQuery();

  return (
    <Stack>
      {isDesktop ? (
        <>
          <NposSort items={sortItems} defaultRefinement={sortDefaultRefinement} query={query}/>
          <NposFilter attribute="organization.sector"/>
        </>
      ) : (
        <Collapse label="Filter/Sort Settings">
          <Stack>
            <NposSort items={sortItems} defaultRefinement={sortDefaultRefinement} query={query}/>
            <NposFilter attribute="organization.sector"/>
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
};

export default NposSortFilterPanel;
