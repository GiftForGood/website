import React from 'react';
import styled from 'styled-components';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import { howItWorksDonor, howItWorksNpo } from '@constants/howItWorks';
import { DONOR } from '@constants/usersType';

const RowOfStepsContainer = styled.div`
  border-top: 1px solid #e4e9f0;
  border-radius: 7px;
  box-shadow: 0 2px 3px #ccc;
  padding: 20px;
`;

const Image = styled.img`
  cursor: pointer;
  height: 200px;
  width: 100%;
  margin-bottom: 50px;
`;

const DesktopSteps = ({ type }) => {
  const contents = type === DONOR ? howItWorksDonor : howItWorksNpo;
  return (
    <RowOfStepsContainer>
      <Stack direction="row" spacing="comfy">
        {contents.map((content) => {
          return (
            <div key={content.src}>
              <Image src={content.src} />
              <Text align="center">{content.description}</Text>
            </div>
          );
        })}
      </Stack>
    </RowOfStepsContainer>
  );
};

export default DesktopSteps;
