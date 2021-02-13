import React, { useState } from 'react';
import styled from 'styled-components';

// components
import { Stack, Button, Modal } from '@kiwicom/orbit-components/lib';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import { OrgWishesFilterBy } from './components';
import { connectRefinementList } from 'react-instantsearch-dom';
import { ModalFooter, ModalSection } from '@kiwicom/orbit-components/lib/Modal';

const ModalContainer = styled.div`
  display: ${({ hide }) => (hide ? 'none' : 'box')};
`;

const WishesFilter = connectRefinementList(OrgWishesFilterBy);

const WishesSortFilterPanel = ({ sortItems, sortDefaultRefinement, category }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Desktop>
        <Stack>
          <WishesFilter attribute="status" />
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
                <WishesFilter attribute="status" />
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
