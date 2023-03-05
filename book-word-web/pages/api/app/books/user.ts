import { getBooksByIds } from '@/dao/book-dao';
import { getUserById } from '@/dao/user-dao';
import UserModel from '@/model/user-model';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET').json('Method Not Allowed');
    return;
  }

  try {
    const userId = req.headers['user-id'] as string;
    const user: UserModel | undefined = await getUserById(userId);
    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }
    const bookIds = user.readingIds;
    const books = getBooksByIds(bookIds);

    return res.status(200).json({
      books,
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
