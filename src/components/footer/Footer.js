import React from 'react';
import styled from 'styled-components';
import { Stack, Text, TextLink, Grid } from '@kiwicom/orbit-components/lib';
import {
  sgFundLogoPath,
  cypressLogoPath,
  cityOfGoodLogoPath,
  nvpcLogoPath,
  gogovanLogoPath,
  redsunmoversLogoPath,
  algoliaLogoPath,
  groundUpCentralLogoPath,
} from '@constants/imagePaths';
import { colors } from '@constants/colors';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${colors.footerBackground};
  position: relative;
  bottom: 0;
`;

const Wrapper = styled.div`
  margin: 0 auto;
  width: 90vw;
  max-width: 1280px;
  box-sizing: border-box;
  padding-top: 40px;
  padding-bottom: 40px;
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
            <a href="https://cypresspac.com.sg/" target="_blank">
              <img src={cypressLogoPath} width="131" height="auto" />
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
            <Text>TOWARDS A</Text>
            <a href="https://cityofgood.sg" target="_blank">
              <img src={cityOfGoodLogoPath} width="100" height="auto" />
            </a>
          </Stack>
          <Stack>
            <Text>A PARTNER OF</Text>
            <a href="https://www.groundupcentral.sg/" target="_blank">
              <img src={groundUpCentralLogoPath} width="100" height="auto" />
            </a>
          </Stack>
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

  const ColumnThree = () => {
    return (
      <div>
        <Stack direction="column" inline>
          <Text weight="bold">About GiftForGood</Text>
          <TextLink asComponent={Link} href="/about" type="secondary" size="small">
            About Us
          </TextLink>
          <TextLink asComponent={Link} href="/privacy-policy" type="secondary" size="small">
            Privacy Policy
          </TextLink>
          <TextLink asComponent={Link} href="/terms-and-conditions" type="secondary" size="small">
            Terms and Conditions
          </TextLink>
          <TextLink asComponent={Link} href="/partners" type="secondary" size="small">
            Partners
          </TextLink>
          <TextLink asComponent={Link} href="https://dsc.comp.nus.edu.sg" type="secondary" size="small">
            Developer Student Club
          </TextLink>
          <TextLink asComponent={Link} href="/contact" type="secondary" size="small">
            Contact Us
          </TextLink>
          <TextLink asComponent={Link} href="/faq" type="secondary" size="small">
            FAQ
          </TextLink>
        </Stack>
      </div>
    );
  };

  const ColumnFour = () => {
    return (
      <div>
        <Stack direction="column" spacing="loose" inline>
          <Stack>
            <Text weight="bold">Logistics</Text>
            <Stack direction="column" spacing="natural">
              <a href="https://www.gogox.com/sg/" target="_blank">
                <img src={gogovanLogoPath} width="120" height="auto" />
              </a>
              <a href="https://www.redsunmovers.com.sg/" target="_blank">
                <img src={redsunmoversLogoPath} width="120" height="auto" />
              </a>
            </Stack>
          </Stack>
          <Stack>
            <Text weight="bold">Search by</Text>
            <a
              href={`https://www.algolia.com/?utm_source=react-instantsearch&utm_medium=website&utm_content=giftforgood.io&utm_campaign=poweredby`}
              target="_blank"
            >
              <img src={algoliaLogoPath} width="120" height="auto" />
            </a>
          </Stack>
        </Stack>
      </div>
    );
  };

  const ColumnFive = () => {
    return (
      <div>
        <Stack direction="column" inline>
          <Text weight="bold">Follow Us</Text>
          <TextLink
            external
            asComponent={Link}
            href="https://www.instagram.com/giftforgood.io/"
            type="secondary"
            size="small"
          >
            Instagram
          </TextLink>
          <TextLink
            external
            asComponent={Link}
            href="https://www.facebook.com/giftforgood.io/"
            type="secondary"
            size="small"
          >
            Facebook
          </TextLink>
          <TextLink
            external
            asComponent={Link}
            href="https://www.linkedin.com/company/gift-for-good/"
            type="secondary"
            size="small"
          >
            LinkedIn
          </TextLink>
        </Stack>
      </div>
    );
  };

  return (
    <>
      {isDesktop ? (
        <Container>
          <Wrapper>
            <Grid columns="1fr 1fr 1fr 1fr 1fr" columnGap="2rem">
              <ColumnOne />
              <ColumnTwo />
              <ColumnThree />
              <ColumnFour />
              <ColumnFive />
            </Grid>
          </Wrapper>
        </Container>
      ) : null}
    </>
  );
};

export default Footer;
