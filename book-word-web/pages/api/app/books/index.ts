import type { NextApiRequest, NextApiResponse } from 'next';
import sameHandler from '../../books/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await sameHandler(req, res);
}
