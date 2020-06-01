import React from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '@kiwicom/orbit-components/lib/Breadcrumbs';
import { Text } from '@kiwicom/orbit-components/lib';
import { wishes } from '../../../utils/constants/postType';

const BreadcrumbsPanel = ({ postType, prevHref, categoryName }) => {
  const isWishPost = postType === wishes;
  return (
    <Breadcrumbs>
      <BreadcrumbsItem href={isWishPost ? '/' : '/donations'}>
        <Text type="secondary">{isWishPost ? 'Wishes' : 'Donations'}</Text>
      </BreadcrumbsItem>
      <BreadcrumbsItem href={prevHref}>
        <Text type="secondary">{categoryName}</Text>
      </BreadcrumbsItem>
    </Breadcrumbs>
  );
};

export default BreadcrumbsPanel;
