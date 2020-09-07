import admin from '@utils/admin-firebase';
import { cors } from '@utils/middleware/cors';
import { SECURE_COOKIE } from '@constants/cookie';
import cookies from '@utils/cookie';

async function handler(req, res) {
  await cors(req, res);

  const { method } = req;
  switch (method) {
    case 'POST':
      const sessionCookie = req.cookies.session || '';

      admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((decodedClaims) => {
          const options = { maxAge: 0, httpOnly: true, secure: SECURE_COOKIE, path: '/' };
          res.cookie('session', '', options);
          res.json({ status: true });
        })
        .catch((error) => {
          res.status(401).json({
            error: {
              message: 'Unauthorized request',
            },
          });
        });
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default cookies(handler);
