import { getUserById, updateUserReadingIds } from '@/dao/user-dao';
import UserModel from '@/model/user-model';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST').json('Method Not Allowed');
    return;
  }

  try {
    const userId = req.headers['user-id'] as string;
    const { bookId } = req.query as { bookId: string };

    const user: UserModel | undefined = await getUserById(userId);
    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    user.readingIds.push(bookId);
    let tempSet = new Set(user.readingIds);
    user.readingIds = Array.from(tempSet);

    await updateUserReadingIds(user);
    res.status(200).json({ message: 'success' });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
