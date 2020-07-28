const Dotenv = require('dotenv-webpack');
const withImages = require('next-images');

module.exports = withImages({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add the new plugin to the existing webpack plugins
    config.plugins.push(new Dotenv({ silent: true }));

    return config;
  },
  // Have to list all the environment variables used here to make it available
  // to the client side code
  env: {
    SECRET: process.env.SECRET,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_ADMIN_PRIVATE_KEY_ID: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_CLIENT_ID: process.env.FIREBASE_ADMIN_CLIENT_ID,
    FIREBASE_ADMIN_URI: process.env.FIREBASE_ADMIN_URI,
    FIREBASE_ADMIN_TOKEN_URI: process.env.FIREBASE_ADMIN_TOKEN_URI,
    FIREBASE_ADMIN_CERT_PROVIDER_URL: process.env.FIREBASE_ADMIN_CERT_PROVIDER_URL,
    FIREBASE_ADMIN_CERT: process.env.FIREBASE_ADMIN_CERT,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
});
