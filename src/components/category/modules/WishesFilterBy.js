import React from 'react';
import { ChoiceGroup, Radio, Separator } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';
import BlackText from '../../text/BlackText';
import * as WishesSortTypeConstant from '../../../../utils/constants/wishesSortType';

const WishesFilterBy = ({ category, filter, setFilter }) => {
  const router = useRouter();
  const handleSelect = (event) => {
    setFilter(event.target.value);
    router.push(`/wishes/category/[categoryId]`, `/wishes/category/${category.id}?filter=${event.target.value}`, {
      shallow: true,
    });
  };
  return (
    <>
      <BlackText style={{ marginBottom: '10px' }} size="large">
        Filter By
      </BlackText>
      <Separator />
      <ChoiceGroup style={{ flexDirection: 'row' }} onChange={(event) => handleSelect(event)}>
        <Radio
          label="Newest - Oldest"
          checked={filter === WishesSortTypeConstant.TIMESTAMP}
          value={WishesSortTypeConstant.TIMESTAMP}
        />
        <Radio
          label="Nearest - Furthest"
          checked={filter === WishesSortTypeConstant.DISTANCE}
          value={WishesSortTypeConstant.DISTANCE}
        />
        <Radio
          label="NPOs (A - Z)"
          checked={filter === WishesSortTypeConstant.NPO_NAME}
          value={WishesSortTypeConstant.NPO_NAME}
        />
      </ChoiceGroup>
    </>
  );
};

export default WishesFilterBy;
