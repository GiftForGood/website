import Head from 'next/head';

const WishHeader = ({ title, description, path, ogImagePath }) => {
  return (
    <Head>
      {/* meta property for sharing purposes */}
      <meta property="og:url" content={`https://www.giftforgood.io${path}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImagePath} />
      <meta property="og:image:secure_url" content={ogImagePath} />
      <meta property="og:image:type" content="image/jpeg" />
    </Head>
  );
};

export default WishHeader;
