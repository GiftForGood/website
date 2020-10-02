import React, { useState } from 'react';
import { Stack, Button, Modal } from '@kiwicom/orbit-components/lib';
import NposSortBy from '../modules/NposSortBy';
import NposFilterBy from '../modules/NposFilterBy';
import { connectSortBy, connectRefinementList } from 'react-instantsearch-dom';
import styled from 'styled-components';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import { ModalFooter, ModalSection } from '@kiwicom/orbit-components/lib/Modal';

const ModalContainer = styled.div`
  display: ${({ hide }) => (hide ? 'none' : 'box')};
`;

const NposSort = connectSortBy(NposSortBy);
const NposFilter = connectRefinementList(NposFilterBy);

const NposSortFilterPanel = ({ sortItems, sortDefaultRefinement, query }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Desktop>
        <Stack>
          <NposSort items={sortItems} defaultRefinement={sortDefaultRefinement} query={query} />
          <NposFilter attribute="organization.sector" />
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
                <NposSort items={sortItems} defaultRefinement={sortDefaultRefinement} query={query} />
                <NposFilter attribute="organization.sector" />
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

export default NposSortFilterPanel;
