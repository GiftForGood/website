import React from 'react';
import Head from 'next/head';
import { favicon } from '@constants/imagePaths';

const Header = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href={favicon} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      <meta
        name="description"
        content="Gift for Good is an online in-kind donations platform that connects donors and non-profit organisations in Singapore to effectively meet the needs of beneficiaries."
      />
    </Head>
  );
};

export default Header;
