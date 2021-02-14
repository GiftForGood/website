import React, { useEffect, useRef } from 'react';

// components
import EmptyStateImage from '@components/imageContainers/EmptyStateImage';
import { Grid } from '@kiwicom/orbit-components/lib';
import WishCard from '@components/card/WishCard';

// hooks
import { useRemoteConfig } from '@components/remoteConfig/RemoteConfig';
import useUser from '@components/session/modules/useUser';

// utils and constants
import { clickedOnWish } from '@utils/algolia/insights';

/**
 * https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#create-a-react-component
 * @param {object[]} hits
 * @param {object} category
 * @param {boolean} hasPrevious
 * @param {boolean} hasMore
 * @param {function} refinePrevious
 * @param {function} refineNext
 */
const WishesHitWrapper = ({ hits, category, hasPrevious, hasMore, refinePrevious, refineNext, refine }) => {
  if (hits.length === 0) {
    return <EmptyStateImage label="No wishes found." />;
  }

  const sentinel = useRef(null);
  const userObject = useUser();
  const remoteConfig = useRemoteConfig();

  const onSentinelIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMore) {
        refine();
      }
    });
  };

  useEffect(() => {
    if (sentinel) {
      const observer = new IntersectionObserver(onSentinelIntersection);
      observer.observe(sentinel.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [sentinel]);

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
        rowGap="30px"
        columnGap="20px"
      >
        {hits.map((hit) => {
          const { objectID, categories, organization, title, description, user, postedDateTime, isBumped, event } = hit;
          const postHref = `/wishes/${objectID}`;
          const profileHref = `/profile/${user.userId}`;
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
              profileHref={profileHref}
              categoryTags={categoryTags}
              isBumped={isBumped}
              categoryId={category.id}
              categoryName={category.name}
              onClick={() => {
                clickedOnWish(userObject, objectID);
              }}
              seasonal={
                remoteConfig?.configs?.currentEvent.key &&
                event?.key &&
                remoteConfig?.configs?.currentEvent.key === event?.key
                  ? event
                  : null
              }
            />
          );
        })}
        <li ref={sentinel} />
      </Grid>
    </>
  );
};

export default WishesHitWrapper;
