import React from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import RoutingCard from '@components/card/RoutingCard';
import { colors } from '@constants/colors';

const CarouselContainer = styled.div`
  position: relative;
  display: flex;
`;

const Row = styled.div`
  max-width: 1280px;
  overflow-x: scroll;
  scroll-behavior: smooth;
  position: relative;
  padding: 10px 3px 10px 3px;
`;

const RoutingCarousel = () => {
  return (
    <CarouselContainer>
      <Row className="scrollableDonation">
        <Stack direction="row" align="start" spacing="natural">
          <RoutingCard label="All wishes" bgColor={colors.npoBackground} href="/wishes/category" />
          <RoutingCard label="All donations" bgColor={colors.donorBackground} href="/donations/category" />
          <RoutingCard label="NPOs" bgColor={colors.yellowBackground} href="/npos" />
        </Stack>
      </Row>
    </CarouselContainer>
  );
};

export default RoutingCarousel;
