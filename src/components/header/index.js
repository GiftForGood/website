import React from 'react';
import Head from 'next/head';
import { favicon } from '@constants/imagePaths';

const Header = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href={favicon} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
    </Head>
  );
};

export default Header;
