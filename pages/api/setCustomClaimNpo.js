import admin from '../../utils/admin-firebase';
import cookies from '../../utils/cookie';
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

      try {
        const decodedClaims = await admin.auth().verifyIdToken(token);
        const userId = decodedClaims.uid;
        await admin.auth().setCustomUserClaims(userId, { npo: true });
        res.json({ status: true });
      } catch (error) {
        console.error(error.message)
        res.status(401).json({
          error: {
            message: 'Unauthorized request',
          },
        });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default cookies(handler);
