import React from 'react';
import HomePage from '../src/components/home/pages/HomePage';

const Home = () => {
  return (
    <div>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Trebuchet MS';
        }
      `}</style>
      <HomePage />
    </div>
  );
};

export default Home;
