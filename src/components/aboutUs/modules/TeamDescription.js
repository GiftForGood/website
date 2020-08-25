import React from 'react';
import styled from 'styled-components';
import { Heading, Text, Stack } from '@kiwicom/orbit-components/lib';
import BlackText from '../../text/BlackText';
import GreyText from '../../text/GreyText';
import Avatar from '../../imageContainers/Avatar';
import { businessTeamMembers, techTeamMembers } from '../../../../utils/constants/members';

const DescriptionContainer = styled.div`
  position: relative;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0 50px;
`;

const DescriptionTitleContainer = styled.div`
  margin: 0 auto;
  margin-bottom: 30px;
`;

const BusinessTeamContainer = styled.div`
  margin-bottom: 50px;
`;

const TechTeamContainer = styled.div`
  margin-bottom: 50px;
`;

const DescriptionDetailsContainer = styled.div``;

const MemberDescriptionContainer = styled.div``;

const MemberDescriptionTitleContainer = styled.div``;

const TeamDescription = () => {
  return (
    <DescriptionContainer>
      <DescriptionTitleContainer>
        <Heading as="h1" type="display">
          Meet the Team
        </Heading>
      </DescriptionTitleContainer>
      <DescriptionDetailsContainer>
        <BusinessTeamContainer>
          <Heading spaceAfter="largest">Business Team</Heading>
          <Stack direction="column" spacing="loose">
            {businessTeamMembers.map((member) => {
              return (
                <Stack direction="row" spacing="extraLoose">
                  <Avatar size="125px" imageUrl={member.imageUrl} />
                  <MemberDescriptionContainer>
                    <Stack direction="column">
                      <MemberDescriptionTitleContainer>
                        <BlackText weight="bold" size="large">
                          {member.name}
                        </BlackText>
                        <GreyText style={{ fontStyle: 'italic' }}>{member.position}</GreyText>
                      </MemberDescriptionTitleContainer>
                      <BlackText>{member.description}</BlackText>
                    </Stack>
                  </MemberDescriptionContainer>
                </Stack>
              );
            })}
          </Stack>
        </BusinessTeamContainer>
        <TechTeamContainer>
          <Heading as="h2" spaceAfter="largest">
            Tech Team
          </Heading>
          <Stack direction="column" spacing="extraLoose">
            {techTeamMembers.map((member) => {
              return (
                <Stack direction="row" spacing="extraLoose">
                  <Avatar size="125px" imageUrl={member.imageUrl} />
                  <MemberDescriptionContainer>
                    <Stack direction="column">
                      <MemberDescriptionTitleContainer>
                        <BlackText weight="bold" size="large">
                          {member.name}
                        </BlackText>
                        <GreyText style={{ fontStyle: 'italic' }}>{member.position}</GreyText>
                      </MemberDescriptionTitleContainer>
                      <BlackText>{member.description}</BlackText>
                    </Stack>
                  </MemberDescriptionContainer>
                </Stack>
              );
            })}
          </Stack>
        </TechTeamContainer>
      </DescriptionDetailsContainer>
    </DescriptionContainer>
  );
};

export default TeamDescription;
