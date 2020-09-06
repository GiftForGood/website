const Dotenv = require('dotenv-webpack');
const withImages = require('next-images');

module.exports = withImages({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(new Dotenv({ silent: true }));

    return config;
  },
  trailingSlash: true,
});
