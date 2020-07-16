import { cors } from '../../utils/middleware/cors';
import mrt from '../../public/assets/mrt-list.json';

async function handler(req, res) {
  await cors(req, res);

  const { method } = req;
  switch (method) {
    case 'GET':
      const operationalMrt = mrt.stations.filter((station) => station.operational === true);
      res.json(operationalMrt);

      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
