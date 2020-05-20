import admin from '../../utils/admin-firebase';
import { cors } from '../../utils/middleware/cors';

async function handler(req, res) {
  await cors(req, res);
  
  const { method } = req;
  switch (method) {
    case 'POST':
      const sessionCookie = req.cookies.session || '';
      res.clearCookie('session');
      admin
        .auth()
        .verifySessionCookie(sessionCookie)
        .then((decodedClaims) => {
          return admin.auth().revokeRefreshTokens(decodedClaims.sub);
        })
        .then(() => {
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

export default handler;
