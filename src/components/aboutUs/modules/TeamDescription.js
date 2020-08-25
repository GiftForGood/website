import React from 'react';
import styled from 'styled-components';
import { Heading, Text, Stack } from '@kiwicom/orbit-components/lib';
import BlackText from '../../text/BlackText';
import GreyText from '../../text/GreyText';
import Avatar from '../../imageContainers/Avatar';

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
const businessTeamMembers = [
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png',
    name: 'Wong Jingwen',
    position: 'Business Head',
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png',
    name: 'Wong Jingwen',
    position: 'Business Head',
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png',
    name: 'Wong Jingwen',
    position: 'Business Head',
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png',
    name: 'Wong Jingwen',
    position: 'Business Head',
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
];

const techTeamMembers = [
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png',
    name: 'Wong Jingwen',
    position: 'Business Head',
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png',
    name: 'Wong Jingwen',
    position: 'Business Head',
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png',
    name: 'Wong Jingwen',
    position: 'Business Head',
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    imageUrl: 'https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png',
    name: 'Wong Jingwen',
    position: 'Business Head',
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
];

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
                      <div>
                        <BlackText weight="bold" size="large">
                          {member.name}
                        </BlackText>
                        <GreyText style={{ fontStyle: 'italic' }}>{member.position}</GreyText>
                      </div>
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
                      <div>
                        <BlackText weight="bold" size="large">
                          {member.name}
                        </BlackText>
                        <GreyText style={{ fontStyle: 'italic' }}>{member.position}</GreyText>
                      </div>
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
