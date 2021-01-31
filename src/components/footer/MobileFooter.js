import React from 'react';
import styled from 'styled-components';
import { Stack, Text, Grid } from '@kiwicom/orbit-components/lib';
import { sgFundLogoPath, nvpcLogoPath } from '@constants/imagePaths';
import { colors } from '@constants/colors';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { MaxWidthContainer } from '@components/containers';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${colors.footer.background};
  position: relative;
  bottom: 0;
`;

const Wrapper = styled(MaxWidthContainer)`
  box-sizing: border-box;
  padding-top: 40px;
  padding-bottom: 40px;
  margin-top: 0;
  margin-bottom: 0;
`;

const Link = styled.a`
  :link {
    text-decoration: none;
  }

  :hover {
    text-decoration: underline;
  }
`;

const Footer = () => {
  const { isDesktop } = useMediaQuery();
  const ColumnOne = () => {
    return (
      <div>
        <Stack direction="column" inline>
          <Text>SUPPORTED BY</Text>
          <Stack direction="column" spacing="natural">
            <a href="https://www.sg/oursingaporefund" target="_blank">
              <img src={sgFundLogoPath} width="131" height="auto" />
            </a>
          </Stack>
        </Stack>
      </div>
    );
  };

  const ColumnTwo = () => {
    return (
      <div>
        <Stack direction="column" spacing="loose" inline>
          <Stack>
            <Text>ENDORSED BY</Text>
            <a href="https://www.cityofgood.sg/nvpc.html" target="_blank">
              <img src={nvpcLogoPath} width="100" height="auto" />
            </a>
          </Stack>
        </Stack>
      </div>
    );
  };

  return (
    <>
      {isDesktop ? null : (
        <Container>
          <Wrapper>
            <Grid columns="1fr 1fr" columnGap="2rem">
              <ColumnOne />
              <ColumnTwo />
            </Grid>
          </Wrapper>
        </Container>
      )}
    </>
  );
};

export default Footer;
