import { saveWord, searchWordsByUserIdAndBookId } from '@/dao/word-dao';
import { WordModel } from '@/model/word-model';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import type { NextApiRequest, NextApiResponse } from 'next';

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { bookId } = req.query as { bookId: string };
  const userId = req.headers['user-id'];
  const { translation, word } = req.body as {
    translation: string;
    word: string;
  };

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
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { bookId } = req.query as { bookId: string };
  const userId = req.headers['user-id'];
  try {
    const list = await searchWordsByUserIdAndBookId(userId as string, bookId);
    res.status(200).json({
      words: list,
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await postHandler(req, res);
    return;
  }

  if (req.method === 'GET') {
    await getHandler(req, res);
    return;
  }

  res.status(405).setHeader('Allow', 'POST, GET').json('Method Not Allowed');
  return;
}
