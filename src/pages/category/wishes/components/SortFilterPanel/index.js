import React, { useState } from 'react';
import styled from 'styled-components';

// components
import { ModalFooter, ModalSection } from '@kiwicom/orbit-components/lib/Modal';
import { connectSortBy, connectRefinementList } from 'react-instantsearch-dom';
import { FilterBy, SortBy } from './components';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import { Stack, Button, Modal } from '@kiwicom/orbit-components/lib';

const ModalContainer = styled.div`
  display: ${({ hide }) => (hide ? 'none' : 'box')};
`;

const WishesSort = connectSortBy(SortBy);
const WishesFilter = connectRefinementList(FilterBy);

const WishesSortFilterPanel = ({ sortItems, sortDefaultRefinement, category, onLatLngUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Desktop>
        <Stack>
          <WishesSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
          <WishesFilter onLatLngUpdated={onLatLngUpdated} attribute="organization.sector" />
        </Stack>
      </Desktop>

      <Mobile>
        <Stack>
          <Button onClick={() => setIsModalOpen(true)} size="small" type="secondary" width={0}>
            Filter/Sort Settings
          </Button>
        </Stack>

        <ModalContainer hide={!isModalOpen}>
          <Modal onClose={() => setIsModalOpen(false)} size="small">
            <ModalSection>
              <Stack>
                <WishesSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
                <WishesFilter onLatLngUpdated={onLatLngUpdated} attribute="organization.sector" />
              </Stack>
            </ModalSection>
            <ModalFooter>
              <Button fullWidth onClick={() => setIsModalOpen(false)} type="secondary">
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </ModalContainer>
      </Mobile>
    </>
  );
};

export default WishesSortFilterPanel;
