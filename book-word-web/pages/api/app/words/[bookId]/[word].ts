import { saveWord } from '@/dao/word-dao';
import { WordModel } from '@/model/word-model';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST').json('Method Not Allowed');
    return;
  }

  const { bookId, word } = req.query as { bookId: string; word: string };
  const userId = req.headers['user-id'];
  const { translation } = req.body as { translation: string };

  try {
    const wordModel: WordModel = {
      id: nanoid(),
      word,
      translation,
      bookId,
      userId: userId as string,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    await saveWord(wordModel);
    res.status(200).json(wordModel);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
