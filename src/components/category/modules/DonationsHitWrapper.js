import React, { useEffect, useRef } from 'react';
import DonationCard from '../../card/DonationCard';
import BlackText from '../../text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';
import { getFormattedDate } from '@api/time';

/**
 * https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#create-a-react-component
 * @param {object[]} hits
 * @param {object} category
 * @param {boolean} hasPrevious
 * @param {boolean} hasMore
 * @param {function} refinePrevious
 * @param {function} refineNext
 */
const DonationsHitWrapper = ({ hits, category, hasPrevious, hasMore, refinePrevious, refineNext }) => {
  if (hits.length === 0) {
    return <BlackText size="medium">No donations found.</BlackText>;
  }

  const sentinel = useRef(null);

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
          const {
            objectID,
            coverImageUrl,
            title,
            description,
            user,
            postedDateTime,
            itemCondition,
            validPeriodFrom,
            validPeriodTo,
          } = hit;
          const postHref = `/donations/${objectID}`;
          const profileHref = `/profile/${user.userId}`;
          const validPeriod = `${getFormattedDate(validPeriodFrom)} - ${getFormattedDate(validPeriodTo)}`;
          return (
            <DonationCard
              key={objectID}
              name={user.userName}
              title={title}
              description={description}
              profileImageUrl={user.profileImageUrl}
              coverImageUrl={coverImageUrl}
              postedDateTime={postedDateTime}
              postHref={postHref}
              profileHref={profileHref}
              itemCondition={itemCondition}
              validPeriod={validPeriod}
              categoryId={category.id}
              categoryName={category.name}
            />
          );
        })}
        <li ref={sentinel} />
      </Grid>
    </>
  );
};

export default DonationsHitWrapper;
