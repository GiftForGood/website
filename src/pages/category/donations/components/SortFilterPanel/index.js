import React, { useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import styled from 'styled-components';

// components
import { Stack, Button, Modal } from '@kiwicom/orbit-components/lib';
import { FilterBy as DonationsFilterBy, SortBy } from './components';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import { ModalFooter, ModalSection } from '@kiwicom/orbit-components/lib/Modal';

const ModalContainer = styled.div`
  display: ${({ hide }) => (hide ? 'none' : 'box')};
`;

const DonationsSort = connectSortBy(SortBy);

const DonationsSortFilterPanel = ({ sortItems, sortDefaultRefinement, category, onLatLngUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Desktop>
        <Stack>
          <DonationsSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
          <DonationsFilterBy onLatLngUpdated={onLatLngUpdated} />
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
                <DonationsSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
                <DonationsFilterBy onLatLngUpdated={onLatLngUpdated} />
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

export default DonationsSortFilterPanel;
