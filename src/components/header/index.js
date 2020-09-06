import React from 'react';
import Head from 'next/head';
import { favicon } from '@constants/imagePaths';

const Header = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href={favicon} />
    </Head>
  );
};

export default Header;
