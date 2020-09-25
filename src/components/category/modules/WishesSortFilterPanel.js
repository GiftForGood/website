import React, { useState } from 'react';
import { Stack, Button, Modal } from '@kiwicom/orbit-components/lib';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import WishesSortBy from '../modules/WishesSortBy';
import WishesFilterby from '../modules/WishesFilterBy';
import { connectSortBy } from 'react-instantsearch-dom';
import { ModalFooter, ModalSection } from '@kiwicom/orbit-components/lib/Modal';
import styled from 'styled-components';

const ModalContainer = styled.div`
  display: ${({ hide }) => (hide ? 'none' : 'box')};
`;

const WishesSort = connectSortBy(WishesSortBy);

const WishesSortFilterPanel = ({ sortItems, sortDefaultRefinement, category, onLatLngUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Desktop>
        <Stack>
          <WishesSort items={sortItems} defaultRefinement={sortDefaultRefinement} category={category} />
          <WishesFilterby onLatLngUpdated={onLatLngUpdated} />
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
                <WishesFilterby onLatLngUpdated={onLatLngUpdated} />
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
