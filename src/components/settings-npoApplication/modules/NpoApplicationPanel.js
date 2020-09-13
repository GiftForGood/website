import React from 'react';
import {
  Button,
  InputField,
  Stack,
  Heading,
  Card,
  CardSection,
  TextLink,
  InputFile,
  Alert,
  Text,
} from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import BadgeStatus from './BadgeStatus';

const Container = styled.div`
  width: 100%;

  ${media.tablet(css`
    width: 100%;
  `)};

  ${media.desktop(css`
    width: 50%;
  `)};
`;

const NpoApplicationPanel = () => {
  return (
    <Container>
      <Card>
        <CardSection>
          <form>
            <Stack spacing="loose">
              <Heading>Your application</Heading>

              <BadgeStatus status={"pending"}/>
            </Stack>
          </form>
        </CardSection>
      </Card>
    </Container>
  );
};

export default NpoApplicationPanel;
