import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Heading, Stack } from '@kiwicom/orbit-components/lib';
import BlackText from '../../text/BlackText';
import GreyText from '../../text/GreyText';
import ProfileAvatar from '@components/imageContainers/ProfileAvatar';
import { marketingTeamMembers, techTeamMembers, partnershipTeamMembers } from '../../../../utils/constants/members';
import Linkify from 'react-linkify';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

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

const MarketingTeamContainer = styled.div`
  margin-bottom: 50px;
`;

const PartnershipTeamContainer = styled.div`
  margin-bottom: 50px;
`;

const TechTeamContainer = styled.div`
  margin-bottom: 50px;
`;

const DescriptionDetailsContainer = styled.div``;

const MemberDescriptionContainer = styled.div``;

const MemberDescriptionTitleContainer = styled.div``;

const TeamSection = ({ teamMembers }) => {
  const { isTablet } = useMediaQuery();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <Stack direction="column" spacing="loose">
      {teamMembers.map((member, index) => {
        return isTablet ? (
          <Stack key={index} direction="row" spacing="extraLoose">
            <ProfileAvatar width="125" height="125" imageUrl={member.imageUrl} />
            <MemberDescriptionContainer>
              <Stack direction="column">
                <MemberDescriptionTitleContainer>
                  <BlackText weight="bold" size="large">
                    {member.name}
                  </BlackText>
                  <GreyText style={{ fontStyle: 'italic' }}>{member.position}</GreyText>
                </MemberDescriptionTitleContainer>
                <Linkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a target="blank" href={decoratedHref} key={key}>
                      {decoratedText}
                    </a>
                  )}
                >
                  <BlackText>{member.description}</BlackText>
                </Linkify>
              </Stack>
            </MemberDescriptionContainer>
          </Stack>
        ) : (
          <Stack key={index} direction="column" spacing="compact" align="center">
            <ProfileAvatar width="100" height="100" imageUrl={member.imageUrl} />
            <MemberDescriptionContainer>
              <Stack direction="column" align="center">
                <MemberDescriptionTitleContainer>
                  <BlackText weight="bold" size="large" align="center">
                    {member.name}
                  </BlackText>
                  <GreyText align="center" style={{ fontStyle: 'italic' }}>
                    {member.position}
                  </GreyText>
                </MemberDescriptionTitleContainer>
                <Linkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a target="blank" href={decoratedHref} key={key}>
                      {decoratedText}
                    </a>
                  )}
                >
                  <BlackText>{member.description}</BlackText>
                </Linkify>
              </Stack>
            </MemberDescriptionContainer>
          </Stack>
        );
      })}
    </Stack>
  );
};

const TeamDescription = () => {
  return (
    <DescriptionContainer>
      <DescriptionTitleContainer>
        <Heading as="h1" type="display">
          Meet the Team
        </Heading>
      </DescriptionTitleContainer>
      <DescriptionDetailsContainer>
        <PartnershipTeamContainer>
          <Heading spaceAfter="largest">Partnerships Team</Heading>
          <TeamSection teamMembers={partnershipTeamMembers} />
        </PartnershipTeamContainer>
        <TechTeamContainer>
          <Heading as="h2" spaceAfter="largest">
            Tech Team
          </Heading>
          <TeamSection teamMembers={techTeamMembers} />
        </TechTeamContainer>
        <MarketingTeamContainer>
          <Heading spaceAfter="largest">Marketing Team</Heading>
          <TeamSection teamMembers={marketingTeamMembers} />
        </MarketingTeamContainer>
      </DescriptionDetailsContainer>
    </DescriptionContainer>
  );
};

export default TeamDescription;
