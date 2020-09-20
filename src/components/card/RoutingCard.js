import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import PropTypes from 'prop-types';

const BorderContainer = styled.div`
  border-radius: 5px;
  transition: border-color 0.1s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ bgColor }) => (bgColor ? bgColor : 'black')};
  min-width: 140px;

  ${media.desktop(css`
    min-width: 200px;
  `)};
`;

const Anchor = styled.a`
  padding: 16px;
  color: ${({ color }) => (color ? color : '#fff')};
  flex-grow: 1;
  text-decoration: none;
`;

const Content = styled.div`
  width: 100%;
`;

const TwoLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

const RoutingCard = ({ label, href, color, bgColor }) => {
  return (
    <BorderContainer bgColor={bgColor}>
      <Anchor color={color} href={href}>
        <Content>
          <TwoLineTextContainer>{label}</TwoLineTextContainer>
        </Content>
      </Anchor>
    </BorderContainer>
  );
};

RoutingCard.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  color: PropTypes.string,
  bgColor: PropTypes.string,
};
export default RoutingCard;
