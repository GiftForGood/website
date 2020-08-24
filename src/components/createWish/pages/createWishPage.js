import React, { useReducer, useMemo } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

import CreateWishPanel from '../modules/createWishPanel';
import LivePreviewPanel from '../modules/livePreviewPanel';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

import initialState from '../initialState';
import reducer from '../reducers';
import WishContext from '../context';

const Container = styled.div`
  display: flex;
  justify-content: center;

  max-width: 1280px;
  margin-top: 25px;
  margin-bottom: 40px;

  ${media.largeMobile(css`
    width: 90vw;
    margin: 0 auto;
    padding-top: 80px;
    padding-bottom: 100px;
  `)};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${media.largeMobile(css`
    max-width: 1280px;
  `)};

  ${media.desktop(css`
    flex-direction: row;
    justify-content: center;
  `)}
`;

const CreateWishPage = ({ wish, mode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isDesktop } = useMediaQuery();

  // prevent re-rendering
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <WishContext.Provider value={contextValue}>
      <Container>
        <Wrapper>
          <CreateWishPanel wish={wish} mode={mode} />
          {isDesktop ? <LivePreviewPanel /> : null}
        </Wrapper>
      </Container>
    </WishContext.Provider>
  );
};

export default CreateWishPage;
