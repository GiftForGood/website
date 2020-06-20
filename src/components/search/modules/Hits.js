import React from 'react';
import { Text, ListChoice } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';

const Hits = ({ hits, type }) => {
  const router = useRouter();
  const handleOnClick = (type, objectID) => {
    router.push(`/${type}/${objectID}`);
  };
  return (
    <>
      {hits.map((hit) => (
        <ListChoice description={hit.description} title={hit.title} onClick={() => handleOnClick(type, hit.objectID)} />
      ))}
    </>
  );
};

export default Hits;
