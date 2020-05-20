import admin from '../../utils/admin-firebase';
import cookies from '../../utils/cookie';
import { SECURE_COOKIE } from '../../utils/constants/cookie';
import { cors } from '../../utils/middleware/cors';

async function handler(req, res) {
  await cors(req, res);

  const { method } = req;
  switch (method) {
    case 'POST':
      // Rest of the API logic
      if (!req.body) {
        return res.status(400).json({
          error: {
            message: 'Bad request. Please check your body.',
          },
        });
      }

      const token = req.body.token;

      // Set session expiration to 5 days.
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      // Create the session cookie. This will also verify the ID token in the process.
      // The session cookie will have the same claims as the ID token.
      // To only allow session cookie setting on recent sign-in, auth_time in ID token
      // can be checked to ensure user was recently signed in before creating a session cookie.
      admin
        .auth()
        .createSessionCookie(token, { expiresIn })
        .then(
          (sessionCookie) => {
            // Set cookie policy for session cookie.
            const options = { maxAge: expiresIn, httpOnly: true, secure: SECURE_COOKIE, path: '/' };
            res.cookie('session', sessionCookie, options);
            res.json({ status: true });
          },
          (error) => {
            res.status(401).json({
              error: {
                message: 'Unauthorized request',
              },
            });
          }
        );
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default cookies(handler);
