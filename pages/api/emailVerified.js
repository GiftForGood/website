import admin from '@utils/admin-firebase';
import { cors } from '@utils/middleware/cors';

async function handler(req, res) {
  await cors(req, res);

  const { method } = req;
  switch (method) {
    case 'POST':
      if (!req.body) {
        return res.status(400).json({
          error: {
            message: 'Bad request. Please check your body.',
          },
        });
      }
      const userId = req.body.id;
      const user = await admin
        .auth()
        .getUser(userId)
        .catch(() => {
          console.error('emailVerified', error);
          res.status(401).json({
            error: {
              message: 'Invalid user ID.',
            },
          });
        });
      res.json({
        emailVerified: user.emailVerified,
      });

      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
