import React, { useReducer, useMemo } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import CreateWishPanel from './components/CreateWishPanel';
import LivePreviewPanel from './components/CreateWishPanel/components/LivePreviewPanel';
import { MaxWidthContainer } from '@components/containers';

// hooks
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

// context
import { initialState, reducer, WishContext } from './context';

const Container = styled(MaxWidthContainer)`
  display: flex;
  justify-content: center;
  flex-direction: column;

  width: 100%;
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
