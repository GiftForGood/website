import React from 'react';
import styled from 'styled-components';
import { Heading, Stack, TextLink } from '@kiwicom/orbit-components/lib';
import BlackText from '../../text/BlackText';

const IconCreditsContainer = styled.div`
  margin-bottom: 50px;
`;

const IconCreditsContent = () => {
  return (
    <Stack>
      <BlackText>
        <TextLink external href="https://www.flaticon.com/free-icon/oil_3082026">
          Oil bottle
        </TextLink>
        ,{' '}
        <TextLink
          external
          href="https://www.flaticon.com/free-icon/baby-products_3081902?term=baby%20bottle&page=1&position=28"
        >
          Baby Products
        </TextLink>
        ,{' '}
        <TextLink external href="https://www.flaticon.com/free-icon/toys_3082048?term=toys&page=1&position=9">
          Toys
        </TextLink>
        ,{' '}
        <TextLink external href="https://www.flaticon.com/free-icon/wheelchair_3225561">
          Wheelchair
        </TextLink>{' '}
        icons made by{' '}
        <TextLink external href="https://www.flaticon.com/authors/iconixar">
          iconixar
        </TextLink>{' '}
        from{' '}
        <TextLink external href="https://www.flaticon.com">
          www.flaticon.com
        </TextLink>
      </BlackText>
      <BlackText>
        <TextLink external href="https://www.flaticon.com/free-icon/oil_3082026">
          Grains Bag
        </TextLink>{' '}
        icon made by{' '}
        <TextLink external href="https://www.flaticon.com/authors/Pixelmeetup">
          Pixelmeetup
        </TextLink>{' '}
        from{' '}
        <TextLink external href="https://www.flaticon.com">
          www.flaticon.com
        </TextLink>
      </BlackText>
      <BlackText>
        <TextLink external href="https://www.flaticon.com/free-icon/laptop_900208">
          Laptop
        </TextLink>
        ,{' '}
        <TextLink external href="https://www.flaticon.com/free-icon/cabinet_3172726?term=dresser&page=1&position=5">
          Furniture
        </TextLink>
        ,{' '}
        <TextLink external href="https://www.flaticon.com/free-icon/ping-pong_3043828">
          Ping Pong
        </TextLink>
        ,{' '}
        <TextLink external href="https://www.flaticon.com/free-icon/box_679922">
          Box
        </TextLink>{' '}
        icons made by{' '}
        <TextLink external href="https://www.flaticon.com/authors/Freepik">
          Freepik
        </TextLink>{' '}
        from{' '}
        <TextLink external href="https://www.flaticon.com">
          www.flaticon.com
        </TextLink>
      </BlackText>
      <BlackText>
        <TextLink external href="https://www.flaticon.com/free-icon/gift_214305">
          Gift Box
        </TextLink>{' '}
        icon made by{' '}
        <TextLink external href="https://www.flaticon.com/authors/pixel-buddha">
          Pixel Buddha
        </TextLink>{' '}
        from{' '}
        <TextLink external href="https://www.flaticon.com">
          www.flaticon.com
        </TextLink>
      </BlackText>
      <BlackText>
        <TextLink external href="https://www.flaticon.com/free-icon/tshirt_3126099">
          T-Shirt
        </TextLink>{' '}
        icon made by{' '}
        <TextLink external href="https://www.flaticon.com/authors/Icongeek26">
          Icongeek26
        </TextLink>{' '}
        from{' '}
        <TextLink external href="https://www.flaticon.com">
          www.flaticon.com
        </TextLink>
      </BlackText>
      <BlackText>
        <TextLink external href="https://www.flaticon.com/free-icon/tools_2249488">
          Tools
        </TextLink>{' '}
        icon made by{' '}
        <TextLink external href="https://www.flaticon.com/authors/srip">
          srip
        </TextLink>{' '}
        from{' '}
        <TextLink external href="https://www.flaticon.com">
          www.flaticon.com
        </TextLink>
      </BlackText>
      <BlackText>
        <TextLink external href="https://www.flaticon.com/free-icon/kitchenware_3063494">
          Kitchenware
        </TextLink>{' '}
        icon made by{' '}
        <TextLink external href="https://www.flaticon.com/authors/ultimatearm">
          ultimatearm
        </TextLink>{' '}
        from{' '}
        <TextLink external href="https://www.flaticon.com">
          www.flaticon.com
        </TextLink>
      </BlackText>
    </Stack>
  );
};

const IconCredits = () => {
  return (
    <IconCreditsContainer>
      <Heading spaceAfter="largest">Icons</Heading>
      <IconCreditsContent />
    </IconCreditsContainer>
  );
};

export default IconCredits;
