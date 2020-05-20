import React from 'react';
import styled from 'styled-components';
import { Text, Heading, Button } from '@kiwicom/orbit-components/lib';
import { colors } from '../../../utils/constants/colors';
import RedButton from '../buttons/RedButton';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 3px;
  box-shadow: 0px 0px 2px 0px rgba(37, 42, 49, 0.16), 0px 1px 4px 0px rgba(37, 42, 49, 0.12);
  min-height: 300px;
`;
const Description = styled.div`
  font-family: 'Roboto', -apple-system, '.SFNSText-Regular', 'San Francisco', 'Segoe UI', 'Helvetica Neue',
    'Lucida Grande', sans-serif;
  font-size: 14px;
  color: #252a31;
  line-height: 20px;
  -webkit-text-size-adjust: 100%;
  width: 100%;
  margin-top: 4px;
`;

const CardContent = styled.div`
  padding: 24px;
`;

const CardAction = styled.div`
  padding: 24px;
`;

const HeadingColor = styled.div`
  color: ${colors.donorBackground};
`;

const Card = ({ onClick, buttonTitle }) => {
  const Title = () => {
    return (
      <div>
        <Text size="large">I am a</Text>
        <Heading type="title2">
          <HeadingColor>Donor</HeadingColor>
        </Heading>
      </div>
    );
  };

  return (
    <CardWrapper>
      <CardContent>
        <Title />
        <Description>With over 300 Non Profit Organizations, you will definitely find something to donate.</Description>
      </CardContent>

      <CardAction>
        <Button fullWidth={true} size="small" asComponent={RedButton} onClick={onClick}>
          {buttonTitle}
        </Button>
      </CardAction>
    </CardWrapper>
  );
};

export default Card;
