import React from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import CanICompleteWish from './CanICompleteWish';
import CanIDeletePostHistory from './CanIDeletePostHistory';
import CanIEditCompletedWishes from './CanIEditCompletedWishes';
import CanIShareAddressOfBeneficiary from './CanIShareAddressOfBeneficiary';
import HowLongPostsLast from './HowLongPostsLast';
import HowToCheckLivePosts from './HowToCheckLivePosts';
import HowToEditPosts from './HowToEditPosts';
import HowToPostLargeQuantities from './HowToPostLargeQuantities';
import HowToPost from './HowToPost';
import HowToWriteWishDescriptions from './HowToWriteWishDescriptions';
import LimitsOnNumberOfPosts from './LimitsOnNumberOfPosts';
import ReopenExpiredWishes from './ReopenExpiredWishes';
import WhatCanIDonate from './WhatCanIDonate';
import WhatCanIRequest from './WhatCanIRequest';
import WhatLocationForWishes from './WhatLocationForWishes';
import WhereToFindDonations from './WhereToFindDonations';
import WhereToViewPostHistory from './WhereToViewPostHistory';
import Topic from '../Topic';

const Posting = () => {
  const AllQuestionAndAnswers = () => {
    return (
      <Stack direction="column">
        <WhatCanIRequest />
        <WhatCanIDonate />
        <HowToPost />
        <HowToWriteWishDescriptions />
        <CanIShareAddressOfBeneficiary />
        <HowToPostLargeQuantities />
        <WhatLocationForWishes />
        <HowToEditPosts />
        <LimitsOnNumberOfPosts />
        <HowLongPostsLast />
        <ReopenExpiredWishes />
        <HowToCheckLivePosts />
        <WhereToFindDonations />
        <WhereToViewPostHistory />
        <CanICompleteWish />
        <CanIDeletePostHistory />
        <CanIEditCompletedWishes />
      </Stack>
    );
  };
  return <Topic title="Posting" contents={<AllQuestionAndAnswers />} />;
};

export default Posting;
