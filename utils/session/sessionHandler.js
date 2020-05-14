// const session = require('express-session');

// const RedisStore = require('connect-redis')(session);
// const redis = require('redis');
// const client = redis.createClient();

// const sessionHandler = session({
//   secret: process.env.SESSION_KEY,
//   saveUninitialized: true,
//   store: new RedisStore({
//     host: 'localhost',
//     port: 6379,
//     client: client,
//     ttl: 260,
//   }),
//   resave: false,
//   rolling: true,
//   cookie: { maxAge: 604800000, httpOnly: true }, // week
// });

// export default sessionHandler;
