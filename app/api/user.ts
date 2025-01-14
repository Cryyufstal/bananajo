import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ firstName: 'John', points: 100, telegramId: '12345' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
