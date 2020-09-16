import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import WishCard from '../../card/WishCard';
import BlackText from '../../text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';
import useUser from '@components/session/modules/useUser';
import { insight } from '@utils/algolia';

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
    return <BlackText size="medium">No wishes found.</BlackText>;
  }

  const sentinel = useRef(null);
  const userObject = useUser();

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
        gap="20px"
      >
        {hits.map((hit) => {
          const { objectID, categories, organization, title, description, user, postedDateTime, isBumped } = hit;
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
                insight('clickedObjectIDs', {
                  userToken: userObject?.userId,
                  index: 'wishes',
                  eventName: 'Clicked on a wish',
                  objectIDs: [objectID],
                });
                insight('viewedObjectIDs', {
                  userToken: userObject?.userId,
                  index: "wishes",
                  eventName: "View Wish Detail Page",
                  objectIDs: [objectID]
                });
              }}
            />
          );
        })}
        <li ref={sentinel} />
      </Grid>
    </>
  );
};

export default WishesHitWrapper;
