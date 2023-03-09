import { deleteWord } from '@/dao/word-dao';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.status(405).setHeader('Allow', 'DELETE').json('Method Not Allowed');
    return;
  }

  const { wordId } = req.query;

  try {
    await deleteWord(wordId as string);
    res.status(200).json({ id: wordId });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
