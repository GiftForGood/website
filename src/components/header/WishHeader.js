import Head from 'next/head';
import { wishOpenGraph } from '@constants/imagePaths';

const WishHeader = ({ title, description, path, id }) => {
  return (
    <Head>
      {/* meta property for sharing purposes */}
      <meta property="og:url" content={`https://www.giftforgood.io${path}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${wishOpenGraph}${id}`} />
      <meta property="og:image:secure_url" content={`${wishOpenGraph}${id}`} />
      <meta property="og:image:type" content="image/png" />
    </Head>
  );
};

export default WishHeader;
