import React, { useEffect, useRef } from 'react';

// components
import BlackText from '@components/text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';
import NpoUserCard from '@components/card/NpoUserCard';

/**
 * https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/#create-a-react-component
 * @param {object[]} hits
 * @param {object} category
 * @param {boolean} hasPrevious
 * @param {boolean} hasMore
 * @param {function} refinePrevious
 * @param {function} refineNext
 */
const NposHitWrapper = ({ hits, category, hasPrevious, hasMore, refinePrevious, refineNext, refine }) => {
  if (hits.length === 0) {
    return <BlackText size="medium">No NPOs found.</BlackText>;
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
          const { objectID, name, organization, email, profileImageUrl, userId } = hit;
          const href = `/profile/${objectID}`;
          return (
            <NpoUserCard
              key={objectID}
              userId={userId}
              name={name}
              organization={organization}
              profileImageUrl={profileImageUrl}
              href={href}
              onClick={() => {}}
            />
          );
        })}
        <li ref={sentinel} />
      </Grid>
    </>
  );
};

export default NposHitWrapper;
