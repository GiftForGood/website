import React from 'react';
import { useRouter } from 'next/router';
import WishCard from '../../card/WishCard';
import BlackText from '../../text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';

/**
 * https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#create-a-react-component
 * @param {object[]} hits
 * @param {object} category
 * @param {boolean} hasPrevious
 * @param {boolean} hasMore
 * @param {function} refinePrevious
 * @param {function} refineNext
 */
const WishesHitWrapper = ({ hits, category, hasPrevious, hasMore, refinePrevious, refineNext }) => {
  if (hits.length === 0) {
    return <BlackText size="medium">No wishes found.</BlackText>;
  }

  return (
    <>
      <Grid
        inline={true}
        largeDesktop={{
          columns: '1fr 1fr 1fr',
        }}
        largeMobile={{
          columns: '1fr 1fr',
        }}
        rows="auto"
        gap="20px"
      >
        {hits.map((hit) => {
          const { objectID, categories, organization, title, description, user, postedDateTime, isBumped } = hit;
          const postHref = `/wishes/${objectID}`;
          const categoryTags = categories.map((category) => category.name);
          return (
            <WishCard
              key={objectID}
              wishId={objectID}
              name={organization.name}
              title={title}
              description={description}
              profileImageUrl={user.profileImageUrl}
              postedDateTime={postedDateTime}
              postHref={postHref}
              categoryTags={categoryTags}
              isBumped={isBumped}
              categoryId={category.id}
              categoryName={category.name}
            />
          );
        })}
      </Grid>
    </>
  );
};

export default WishesHitWrapper;
