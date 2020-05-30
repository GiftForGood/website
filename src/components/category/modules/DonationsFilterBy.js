import React from 'react';
import { ChoiceGroup, Radio, Separator } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';
import BlackText from '../../text/BlackText';
import * as DonationsSortTypeConstant from '../../../../utils/constants/donationsSortType';

const DonationsFilterBy = ({ category, filter, setFilter }) => {
  const router = useRouter();
  const handleSelect = (event) => {
    setFilter(event.target.value);
    if (category) {
      router.push(
        `/donations/category/[categoryId]`,
        `/donations/category/${category.id}?filter=${event.target.value}`,
        {
          shallow: true,
        }
      );
    } else {
      // for view all donations
      router.push(`/donations/category`, `/donations/category?filter=${event.target.value}`, {
        shallow: true,
      });
    }
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
          checked={filter === DonationsSortTypeConstant.TIMESTAMP}
          value={DonationsSortTypeConstant.TIMESTAMP}
        />
        <Radio
          label="Nearest - Furthest"
          checked={filter === DonationsSortTypeConstant.DISTANCE}
          value={DonationsSortTypeConstant.DISTANCE}
        />
      </ChoiceGroup>
    </>
  );
};

export default DonationsFilterBy;
