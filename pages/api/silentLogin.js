import admin from '../../utils/admin-firebase';
import cookie from 'cookie';

async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case 'GET':
      const cookies = cookie.parse(req.headers.cookie || '');
      const sessionCookie = cookies.session || ''
      // Verify the session cookie. In this case an additional check is added to detect
      // if the user's Firebase session was revoked, user deleted/disabled, etc.
      admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((decodedClaims) => {
          res.json(decodedClaims);
        })
        .catch((error) => {
          // Session cookie is unavailable or invalid. Force user to login.
          res.status(401).json({
            error: {
              message: 'Unauthorized request',
            },
          });
        });
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
